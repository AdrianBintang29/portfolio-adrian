'use client';

import { Reveal } from './Reveal';
import { HeroStarsCanvas } from './HeroStarsCanvas';

interface HeroProps {
  profile: {
    name: string;
    heroHeadline: string;
    bio: string;
  };
}

export function Hero({ profile }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-100px)] flex items-center overflow-hidden bg-bg px-6 py-20 md:py-32 cursor-default"
    >
      {/* 1. Interactive Celestial Starfield Canvas (Fisika Tolak Kursor ala Akmal) */}
      <HeroStarsCanvas />

      {/* 2. Typographic Content Layer */}
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="max-w-2xl">
          {/* Headline Typography */}
          <Reveal delayMs={0}>
            <div>
              <p className="text-2xl font-bold text-muted sm:text-3xl">
                Hello,
              </p>
              <p className="mt-1 text-5xl font-extrabold tracking-tight text-ink sm:text-7xl md:text-8xl">
                I am <span className="text-accent">{profile.name.split(' ')[1] || profile.name}</span>,
              </p>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl md:text-6xl leading-[1.12]">
                {profile.heroHeadline}
              </h1>
            </div>
          </Reveal>

          {/* Bio nyata dari database */}
          <Reveal delayMs={100}>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted md:text-xl">
              {profile.bio}
            </p>
          </Reveal>

          {/* CTA Buttons */}
          <Reveal delayMs={200}>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-lg border-2 border-accent bg-accent px-8 py-4 text-sm font-bold text-white shadow-md transition-all hover:bg-accent-hover hover:shadow-[0_8px_20px_rgba(234,88,12,0.3)]"
              >
                Let&apos;s get in touch!
              </a>

              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-lg border border-line bg-surface px-8 py-4 text-sm font-bold text-ink shadow-xs transition-all hover:border-accent hover:text-accent"
              >
                Lihat Proyek →
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
