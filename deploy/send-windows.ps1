#Requires -Version 7.0
<#
.SYNOPSIS
  Mengirim kiriman image ke VPS dari Windows (bukan dari WSL), per potongan kecil, dan mengulang sendiri.

.DESCRIPTION
  Jaringan WSL di laptop ini macet saat upload, sedangkan Windows langsung cepat. Skrip ini dijalankan di
  PowerShell 7 (pwsh). File dipotong menjadi potongan 8 MB. Tiap potongan dikirim dengan scp dan batas waktu
  sendiri, jadi satu potongan yang macet cukup diulang tanpa mengulang seluruh file. Potongan yang sudah
  sampai (ukurannya cocok) dilewati kalau skrip dijalankan lagi. Di akhir, VPS merakit potongan menjadi satu
  file dan mencocokkan sha256.

  Passphrase hanya diketik SEKALI, saat kunci dimasukkan ke ssh-agent. Skrip tidak pernah menyimpan atau
  menampilkannya.

  Cara pakai (di PowerShell 7, folder project):
      pwsh -File deploy\send-windows.ps1
#>
[CmdletBinding()]
param(
  [string] $File       = (Join-Path $env:USERPROFILE 'Downloads\portfolio-ship\portfolio-images.tar.gz'),
  [string] $Key        = (Join-Path $env:USERPROFILE '.ssh\id_ed25519_portfolio'),
  [string] $HostName   = '38.101.149.25',
  [int]    $Port       = 22333,
  [string] $User       = 'root',
  [string] $RemoteDir  = '/opt/portfolio',
  [int]    $ChunkMB    = 8,
  [int]    $Parallel   = 3,
  [int]    $MaxRounds  = 25,
  [int]    $ChunkTimeoutSeconds = 90,
  [string] $KnownHostsFile = '',
  # Hanya untuk pengujian: folder berisi ssh.exe, scp.exe, ssh-add.exe, dan ssh-keygen.exe pengganti.
  [string] $ToolDir = ''
)

$ErrorActionPreference = 'Stop'

function Fail([string] $Message) { Write-Host "BERHENTI: $Message" -ForegroundColor Red; exit 1 }

if (-not (Test-Path -LiteralPath $File)) { Fail "File kiriman tidak ada: $File`n  Salin dari Ubuntu dulu (lihat panduan)." }
if (-not (Test-Path -LiteralPath $Key))  { Fail "Kunci SSH tidak ada: $Key" }
$sumFile = "$File.sha256"
if (-not (Test-Path -LiteralPath $sumFile)) { Fail "Berkas segel tidak ada: $sumFile" }

$expectedSum = ((Get-Content -LiteralPath $sumFile -Raw).Trim() -split '\s+')[0].ToLower()
if ($expectedSum -notmatch '^[0-9a-f]{64}$') { Fail "Isi berkas segel tidak valid." }

# --- Alat SSH dan ssh-agent --------------------------------------------------------------------------------
# Pilihan 1: OpenSSH Windows, kalau layanan ssh-agent-nya hidup.
# Pilihan 2: ssh, scp, dan ssh-agent milik Git for Windows. Agent-nya bisa dijalankan tanpa hak Administrator.
$gitBin = 'C:\Program Files\Git\usr\bin'
$agentService = Get-Service ssh-agent -ErrorAction SilentlyContinue
$script:StartedAgentPid = $null

if ($ToolDir) {
  $sshExe = Join-Path $ToolDir 'ssh.exe'; $scpExe = Join-Path $ToolDir 'scp.exe'
  $sshAddExe = Join-Path $ToolDir 'ssh-add.exe'; $keygenExe = Join-Path $ToolDir 'ssh-keygen.exe'
  $keyArg = $Key
  Write-Host "Alat SSH   : pengganti uji di $ToolDir"
}
elseif ($agentService -and $agentService.Status -eq 'Running') {
  $sshExe = 'ssh.exe'; $scpExe = 'scp.exe'; $sshAddExe = 'ssh-add.exe'; $keygenExe = 'ssh-keygen.exe'
  $keyArg = $Key
  Write-Host "Alat SSH   : OpenSSH Windows (layanan ssh-agent hidup)"
}
elseif (Test-Path (Join-Path $gitBin 'ssh-agent.exe')) {
  $sshExe = Join-Path $gitBin 'ssh.exe'; $scpExe = Join-Path $gitBin 'scp.exe'
  $sshAddExe = Join-Path $gitBin 'ssh-add.exe'; $keygenExe = Join-Path $gitBin 'ssh-keygen.exe'
  $keyArg = $Key -replace '\\', '/'
  $agentOutput = & (Join-Path $gitBin 'ssh-agent.exe') -s
  if ($agentOutput -match 'SSH_AUTH_SOCK=([^;]+);') { $env:SSH_AUTH_SOCK = $Matches[1] } else { Fail "Gagal menjalankan ssh-agent milik Git." }
  if ($agentOutput -match 'SSH_AGENT_PID=(\d+);')  { $env:SSH_AGENT_PID = $Matches[1]; $script:StartedAgentPid = [int]$Matches[1] }
  Write-Host "Alat SSH   : Git for Windows (agent sementara, dimatikan otomatis di akhir)"
}
else {
  Fail "Tidak ada ssh-agent yang bisa dipakai. Jalankan PowerShell sebagai Administrator sekali: Set-Service ssh-agent -StartupType Manual; Start-Service ssh-agent"
}

function Stop-OwnAgent {
  if ($script:StartedAgentPid) { try { Stop-Process -Id $script:StartedAgentPid -Force -ErrorAction SilentlyContinue } catch {} }
}

# Pastikan kunci ada di agent. Di sinilah passphrase diketik, satu kali.
$fingerprint = ((& $keygenExe -lf "$Key.pub") -split '\s+')[1]
$loaded = (& $sshAddExe -l 2>&1 | Out-String)
if ($loaded -notmatch [regex]::Escape($fingerprint)) {
  Write-Host ""
  Write-Host "==> Memasukkan kunci ke ssh-agent. Ketik passphrase kunci (hurufnya tidak terlihat), lalu Enter." -ForegroundColor Cyan
  & $sshAddExe $keyArg
  if ($LASTEXITCODE -ne 0) { Stop-OwnAgent; Fail "Kunci gagal dimasukkan ke ssh-agent (passphrase salah?)." }
}

$name      = Split-Path -Leaf $File
$chunkSize = [int64]$ChunkMB * 1MB
$total     = (Get-Item -LiteralPath $File).Length
$count     = [int][math]::Ceiling($total / $chunkSize)
$partDir   = "$RemoteDir/.parts-$($expectedSum.Substring(0,12))"
$target    = "$User@$HostName"

$common = @(
  '-i', $keyArg, '-o', 'IdentitiesOnly=yes',
  '-o', 'ServerAliveInterval=10', '-o', 'ServerAliveCountMax=3',
  '-o', 'ConnectTimeout=20'
)
if ($KnownHostsFile) { $common += @('-o', "UserKnownHostsFile=$($KnownHostsFile -replace '\\','/')") }
$sshOpts = @('-p', "$Port") + $common
$scpOpts = @('-P', "$Port", '-o', 'BatchMode=yes') + $common

Write-Host ""
Write-Host "File       : $name ($([math]::Round($total/1MB,1)) MB, $count potongan @ $ChunkMB MB)"
Write-Host "Tujuan     : ${target}:$RemoteDir (port $Port)"
Write-Host "Segel      : $($expectedSum.Substring(0,16))..."
Write-Host ""

function Invoke-Remote([string] $Command, [int] $TimeoutSeconds = 60) {
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = $sshExe
  $psi.UseShellExecute = $false
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true
  foreach ($a in ($sshOpts + @('-o', 'BatchMode=yes', $target, $Command))) { [void]$psi.ArgumentList.Add($a) }
  $p = [System.Diagnostics.Process]::Start($psi)
  $outTask = $p.StandardOutput.ReadToEndAsync()
  $errTask = $p.StandardError.ReadToEndAsync()
  if (-not $p.WaitForExit($TimeoutSeconds * 1000)) { try { $p.Kill($true) } catch {}; return @{ Code = 124; Out = ''; Err = 'waktu habis' } }
  return @{ Code = $p.ExitCode; Out = $outTask.Result.Trim(); Err = $errTask.Result.Trim() }
}

try {
  # --- Sambungan pertama (interaktif): di sini sidik jari server ditanyakan kalau belum dikenal. -----------
  Write-Host "==> Menguji sambungan ke VPS (kamu mungkin ditanya sidik jari server: bandingkan lalu ketik yes)" -ForegroundColor Cyan
  & $sshExe @sshOpts -o 'StrictHostKeyChecking=ask' $target "mkdir -p '$partDir' && echo sambungan-ok"
  if ($LASTEXITCODE -ne 0) { Fail "Tidak bisa tersambung ke VPS. Periksa kunci, passphrase, dan sidik jari server." }

  function Get-ExpectedSize([int] $Index) {
    if ($Index -lt $count - 1) { return $chunkSize }
    return $total - ($chunkSize * ($count - 1))
  }

  function Get-RemoteParts {
    $r = Invoke-Remote "cd '$partDir' 2>/dev/null && stat -c '%n %s' part-* 2>/dev/null; true"
    $have = @{}
    if ($r.Out) {
      foreach ($line in $r.Out -split "`n") {
        $bits = $line.Trim() -split ' '
        if ($bits.Count -eq 2) { $have[$bits[0]] = [int64]$bits[1] }
      }
    }
    return $have
  }

  # --- Potong di Windows (sekali, di folder sementara) --------------------------------------------------
  $workDir = Join-Path $env:TEMP "portfolio-chunks-$($expectedSum.Substring(0,12))"
  New-Item -ItemType Directory -Force -Path $workDir | Out-Null
  function Get-PartName([int] $Index) { 'part-{0:D4}' -f $Index }

  Write-Host "==> Memotong file menjadi $count potongan di $workDir" -ForegroundColor Cyan
  $fs = [System.IO.File]::OpenRead($File)
  try {
    $buffer = New-Object byte[] (1MB)
    for ($i = 0; $i -lt $count; $i++) {
      $path = Join-Path $workDir (Get-PartName $i)
      $want = Get-ExpectedSize $i
      if ((Test-Path -LiteralPath $path) -and ((Get-Item -LiteralPath $path).Length -eq $want)) { [void]$fs.Seek($want, 'Current'); continue }
      $out = [System.IO.File]::Create($path)
      try {
        $remaining = $want
        while ($remaining -gt 0) {
          $read = $fs.Read($buffer, 0, [int][math]::Min($buffer.Length, $remaining))
          if ($read -le 0) { throw "File berakhir lebih cepat dari perkiraan." }
          $out.Write($buffer, 0, $read)
          $remaining -= $read
        }
      } finally { $out.Dispose() }
    }
  } finally { $fs.Dispose() }

  # --- Kirim potongan, ulangi putaran sampai semua sampai ----------------------------------------------
  $sw = [System.Diagnostics.Stopwatch]::StartNew()

  for ($round = 1; $round -le $MaxRounds; $round++) {
    $have = Get-RemoteParts
    $pending = @()
    for ($i = 0; $i -lt $count; $i++) {
      $pn = Get-PartName $i
      if (-not ($have.ContainsKey($pn) -and $have[$pn] -eq (Get-ExpectedSize $i))) { $pending += $i }
    }

    $done = $count - $pending.Count
    Write-Host ("---- putaran {0}: {1}/{2} potongan sudah di VPS, sisa {3} ({4:n0} dtk berjalan)" -f $round, $done, $count, $pending.Count, $sw.Elapsed.TotalSeconds)
    if ($pending.Count -eq 0) { break }

    # Beberapa potongan sekaligus. Tiap scp punya batas waktu sendiri, jadi satu yang macet tidak menahan yang lain.
    # Berkas dikirim dengan nama relatif dari folder potongan, karena scp milik Git membaca "C:" sebagai nama host.
    $jobs = @()
    foreach ($i in $pending) {
      while (@($jobs | Where-Object { $_.State -eq 'Running' }).Count -ge $Parallel) { Start-Sleep -Milliseconds 300 }
      $pn = Get-PartName $i
      $jobs += Start-Job -ArgumentList $scpExe, ($scpOpts -join '|'), $pn, "$target`:$partDir/$pn.tmp", $ChunkTimeoutSeconds, $i, $workDir -ScriptBlock {
        param($scp, $optString, $local, $remote, $timeout, $index, $folder)
        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = $scp
        $psi.UseShellExecute = $false
        $psi.RedirectStandardError = $true
        # Folder kerja HARUS diatur pada proses scp itu sendiri. Start-Job -WorkingDirectory hanya mengubah
        # lokasi PowerShell, bukan folder kerja proses anak yang dibuat lewat ProcessStartInfo.
        $psi.WorkingDirectory = $folder
        foreach ($a in (($optString -split '\|') + @($local, $remote))) { [void]$psi.ArgumentList.Add($a) }
        $p = [System.Diagnostics.Process]::Start($psi)
        $errTask = $p.StandardError.ReadToEndAsync()
        if (-not $p.WaitForExit($timeout * 1000)) { try { $p.Kill($true) } catch {}; return [pscustomobject]@{ Index = $index; Ok = $false; Why = 'macet (waktu habis)' } }
        return [pscustomobject]@{ Index = $index; Ok = ($p.ExitCode -eq 0); Why = $errTask.Result.Trim() }
      }
    }
    $results = $jobs | Wait-Job | Receive-Job
    $jobs | Remove-Job -Force
    $okCount  = @($results | Where-Object { $_.Ok }).Count
    $badCount = @($results | Where-Object { -not $_.Ok }).Count
    Write-Host "     terkirim $okCount, gagal atau macet $badCount"
    foreach ($bad in ($results | Where-Object { -not $_.Ok } | Select-Object -First 2)) { Write-Host "       potongan $($bad.Index): $($bad.Why)" -ForegroundColor DarkYellow }

    # Potongan tiba dengan nama sementara (.tmp), lalu diberi nama final hanya kalau ukurannya benar.
    $promote = ($pending | ForEach-Object {
      $pn = Get-PartName $_; $want = Get-ExpectedSize $_
      "if [ -f '$partDir/$pn.tmp' ] && [ `$(stat -c %s '$partDir/$pn.tmp') -eq $want ]; then mv -f '$partDir/$pn.tmp' '$partDir/$pn'; else rm -f '$partDir/$pn.tmp'; fi"
    }) -join '; '
    $null = Invoke-Remote $promote 90

    if ($badCount -gt 0) { Start-Sleep -Seconds 2 }
  }

  $have = Get-RemoteParts
  $missing = @(0..($count - 1) | Where-Object { $pn = Get-PartName $_; -not ($have.ContainsKey($pn) -and $have[$pn] -eq (Get-ExpectedSize $_)) })
  if ($missing.Count -gt 0) { Fail "Masih ada $($missing.Count) potongan yang belum sampai setelah $MaxRounds putaran. Jalankan skrip ini lagi, ia melanjutkan." }

  # --- Rakit dan cocokkan segel di VPS --------------------------------------------------------------------
  Write-Host "==> Merakit potongan di VPS dan mencocokkan segel" -ForegroundColor Cyan
  $assemble = @"
set -e
cd '$partDir'
cat `$(ls part-???? | sort) > '../$name.new'
actual=`$(sha256sum '../$name.new' | cut -d' ' -f1)
if [ "`$actual" = '$expectedSum' ]; then
  mv -f '../$name.new' '../$name'
  printf '%s  %s\n' '$expectedSum' '$name' > '../$name.sha256'
  rm -rf '$partDir'
  echo SEGEL-COCOK
else
  # Salah satu potongan rusak walau ukurannya benar. Buang SEMUA supaya percobaan berikutnya mulai bersih.
  rm -f '../$name.new'
  rm -rf '$partDir'
  echo "SEGEL-BEDA `$actual"
  exit 3
fi
"@
  $r = Invoke-Remote $assemble 300
  if ($r.Out -match 'SEGEL-COCOK') {
    Write-Host ""
    Write-Host "SELESAI: file di VPS identik dengan yang di laptop. ($([math]::Round($sw.Elapsed.TotalSeconds)) detik)" -ForegroundColor Green
    Remove-Item -LiteralPath $workDir -Recurse -Force -ErrorAction SilentlyContinue
    exit 0
  }

  Write-Host $r.Out
  Write-Host $r.Err
  Fail "Segel TIDAK cocok setelah dirakit. Potongan di VPS sudah dibuang, jalankan skrip ini sekali lagi untuk mengirim ulang dari awal."
}
finally {
  Stop-OwnAgent
}
