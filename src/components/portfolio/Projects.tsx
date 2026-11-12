import { getProjects } from '@/lib/db/queries';
import { Reveal } from './Reveal';
import { ProjectCard } from './ProjectCard';

export async function Projects() {
  const projects = await getProjects();

  return (
    <section id="projects" className="relative bg-bg py-24 md:py-36 border-t border-line overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[380px_1fr] lg:items-start">
          {/* Kolom Kiri: Statement Header ala Gambar 3 */}
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl leading-[1.12]">
                Take a look at what I&apos;ve created and be inspired by
              </h2>
            </Reveal>

            <Reveal delayMs={100}>
              <p className="mt-6 text-base leading-relaxed text-muted">
                Koleksi sistem dan aplikasi yang saya bangun secara mandiri. Geser ke kanan untuk menjelajahi proyek lainnya.
              </p>
            </Reveal>

            <Reveal delayMs={180}>
              <div className="mt-8 flex items-center gap-3">
                <a
                  href="https://github.com/AdrianBintang29"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-accent bg-transparent px-6 py-3 text-xs font-bold text-accent transition-all hover:bg-accent hover:text-white hover:shadow-[0_8px_20px_rgba(234,88,12,0.25)]"
                >
                  <span>Jelajahi Repositori</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </Reveal>

            {/* Hint scroll horizontal */}
            <div className="mt-10 hidden lg:flex items-center gap-2 text-xs font-semibold text-muted">
              <span>Scroll horizontal</span>
              <span className="text-accent font-bold" aria-hidden="true">&rarr;</span>
            </div>
          </div>

          {/* Kolom Kanan: Horizontal Scroll Track SEJAJAR SEMPURNA (items-stretch) */}
          <div className="overflow-hidden">
            <div className="horizontal-scroll flex items-stretch gap-5 sm:gap-6 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory -mx-6 px-6 lg:mx-0 lg:px-0">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
