import Image from 'next/image';
import { getProfile } from '@/lib/db/queries';
import { splitParagraphs } from '@/lib/text';
import { Reveal } from './Reveal';

export async function About() {
  const profile = await getProfile();
  const paragraphs = splitParagraphs(profile.aboutBody);

  return (
    <section id="about" className="relative bg-bg py-24 md:py-36 border-t border-line">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[300px_1fr] lg:items-start">
          {/* Kolom Kiri: Meta Header + Foto Profil */}
          <Reveal>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">
                  About Me
                </span>
                <p className="text-2xl font-extrabold text-ink">
                  {profile.name}
                </p>
                {/* Role dinamis profil dari database */}
                <p className="text-sm font-medium text-muted">
                  {profile.role}
                </p>
              </div>

              {/* Bingkai Foto Profil Aspect 4:5 */}
              <div className="relative aspect-4/5 w-full max-w-[280px] overflow-hidden rounded-2xl border border-line bg-surface shadow-md">
                <Image
                  src={profile.avatarUrl || '/profile1.jpg'}
                  alt={`Foto profil ${profile.name}`}
                  fill
                  unoptimized
                  sizes="280px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />

                {/* Soft gradient edge fade */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60"
                  aria-hidden="true"
                />
              </div>
            </div>
          </Reveal>

          {/* Kolom Kanan: Narasi Cerita Murni dari Database */}
          <div className="max-w-3xl">
            <Reveal delayMs={120}>
              <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl leading-[1.12]">
                {profile.aboutTitle}
              </h2>
            </Reveal>

            <Reveal delayMs={200}>
              <div className="about-body mt-8 space-y-6 text-base leading-relaxed text-muted md:text-lg">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="whitespace-pre-line text-ink/90">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
