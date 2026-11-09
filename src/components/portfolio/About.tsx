export function About() {
  return (
    <section id="about" className="border-t border-gray-blue/20 bg-paper py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
        <div
          role="img"
          aria-label="Visual placeholder tentang Adrian"
          className="flex aspect-4/5 w-full items-center justify-center border border-navy/20 bg-navy-soft text-center text-xs font-semibold uppercase tracking-widest text-paper"
        >
          Foto / Visual Workspace
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-blue">
            Tentang Aku
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy md:text-5xl">
            Gaming & Coding
          </h2>

          <div className="mt-6 space-y-4 text-base leading-7 text-gray-blue">
            <p>
              Saya adalah pengembang web yang fokus memahami siklus utuh software: mulai dari interface yang responsif, logika backend API, persistensi database, hingga proses orkestrasi container dan deployment server.
            </p>
            <p>
              Alih-alih sekadar memakai framework atau library instan tanpa tahu cara kerjanya, saya lebih suka mengeksplorasi alasan teknis di balik setiap konfigurasi—seperti bagaimana Docker mengisolasi aplikasi, bagaimana reverse proxy meneruskan request, atau bagaimana schema database dimigrasi secara aman.
            </p>
            <p>
              Portfolio ini dan seluruh infrastruktur di belakangnya dibangun sebagai media belajar langsung dan dokumentasi progres rekayasa perangkat lunak saya.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}