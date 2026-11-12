import { experiences } from '@/lib/data/experience';
import { Reveal } from './Reveal';

export function Experience() {
  return (
    <section id="experience" className="relative bg-bg py-24 md:py-36 border-t border-line">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header Section */}
        <Reveal>
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              Career & Experience
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl">
              Work Experience
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Rekam jejak pengalaman kerja nyata dalam rekayasa perangkat lunak, integrasi backend API, dan pemeliharaan infrastruktur hosting.
            </p>
          </div>
        </Reveal>

        {/* Experience Cards Grid */}
        <div className="mt-14 flex flex-col gap-8">
          {experiences.map((exp, idx) => (
            <Reveal key={exp.id} delayMs={idx * 120}>
              <article className="group relative flex flex-col justify-between rounded-3xl border border-line bg-surface p-8 sm:p-10 shadow-sm transition-all duration-300 hover:border-accent hover:shadow-[0_12px_28px_rgba(28,25,23,0.08)]">
                {/* Header Kartu: Perusahaan, Tipe, Periode & Lokasi */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-line/60 pb-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold tracking-tight text-ink group-hover:text-accent transition-colors">
                        {exp.company}
                      </h3>
                      <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent border border-accent/20">
                        {exp.type}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-ink">
                      {exp.role}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span>{exp.period}</span>
                    </span>

                    <span className="text-line">·</span>

                    <span className="inline-flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>{exp.location}</span>
                    </span>
                  </div>
                </div>

                {/* Deskripsi & Poin-poin Tugas Teknis */}
                <div className="mt-6">
                  <p className="text-sm sm:text-base leading-relaxed text-muted">
                    {exp.summary}
                  </p>

                  <ul className="mt-6 flex flex-col gap-3">
                    {exp.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-3 text-sm text-ink leading-relaxed">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Kartu: Stack Teknologi Terpakai */}
                <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-line/60 pt-6">
                  <span className="text-xs font-bold text-muted mr-2">Teknologi:</span>
                  {exp.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-line bg-surface-raised px-3 py-1 text-xs font-semibold text-muted"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
