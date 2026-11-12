import { getProfile } from '@/lib/db/queries';

export async function Footer() {
  const profile = await getProfile();

  return (
    <footer className="relative bg-bg pb-16 pt-8 text-ink border-t border-line">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-end gap-6 text-xs text-muted md:flex-row">
          <div className="flex items-center gap-6 font-medium">
            <a href="#top" className="transition-colors hover:text-accent">
              Kembali ke Atas ↑
            </a>
            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-accent"
              >
                GitHub
              </a>
            )}
            <a
              href={`mailto:${profile.email}`}
              className="transition-colors hover:text-accent"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
