import { getProfile } from '@/lib/db/queries';
import { Reveal } from './Reveal';
import { CopyEmailButton } from './CopyEmailButton';

export async function Contact() {
  const profile = await getProfile();

  return (
    <section id="contact" className="relative bg-bg py-24 md:py-36 border-t border-line">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-center">
          {/* Judul Besar Kiri */}
          <Reveal>
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">
                Contact
              </span>
              <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl md:text-6xl leading-[1.08]">
                Let&apos;s talk about<br />
                your project
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted">
                {profile.contactDescription}
              </p>
            </div>
          </Reveal>

          {/* Tombol Aksi Kanan Lengkap ala Abyasa */}
          <Reveal delayMs={120}>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center justify-center rounded-lg border-2 border-accent bg-accent px-8 py-4 text-sm font-bold text-white shadow-md transition-all hover:bg-accent-hover hover:shadow-[0_8px_20px_rgba(234,88,12,0.3)]"
              >
                <span>Contact me</span>
                <span aria-hidden="true" className="ml-2">↗</span>
              </a>

              {/* Fitur Copy Email instan */}
              <CopyEmailButton email={profile.email} />

              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-line bg-surface px-6 py-4 text-sm font-bold text-ink shadow-xs transition-all hover:border-accent hover:text-accent"
                >
                  <span>Lihat GitHub ↗</span>
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
