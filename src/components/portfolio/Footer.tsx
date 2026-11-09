import { getProfile } from '@/lib/db/queries';

export async function Footer() {
  const profile = await getProfile();

  return (
    <footer className="bg-navy pt-20 pb-12 text-paper">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-paper/60">
              Web Engineering & Infrastructure
            </p>
            <h2 className="mt-3 text-4xl font-extrabold uppercase tracking-tight md:text-6xl">
              {profile.name}
            </h2>
          </div>

          <div className="flex flex-wrap gap-8 text-sm font-semibold text-paper/80">
            <a
              href="#top"
              className="transition-colors hover:text-yellow"
            >
              Kembali ke Atas ↑
            </a>

            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-yellow"
              >
                GitHub ↗
              </a>
            )}

            <a
              href={`mailto:${profile.email}`}
              className="transition-colors hover:text-yellow"
            >
              Email ↗
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-paper/15 pt-8 text-xs text-paper/50 md:flex-row md:items-center">
          <p>© 2026 {profile.name}. Dirancang dan dibangun secara mandiri.</p>
          <p>Next.js App Router · Tailwind CSS · Docker · VPS Ubuntu</p>
        </div>
      </div>
    </footer>
  );
}