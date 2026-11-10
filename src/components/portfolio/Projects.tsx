import Image from 'next/image';
import { getProjects } from '@/lib/db/queries';

export async function Projects() {
  const projects = await getProjects();

  return (
    <section id="projects" className="border-t border-gray-blue/20 bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-blue">
            Selected Work
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy md:text-5xl">
            Project Pilihan
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-blue">
            Kumpulan project nyata yang saya bangun untuk mempelajari siklus hidup software dari rancangan interface, backend API, hingga deployment server.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.id}
              className="flex flex-col border border-navy/15 bg-white p-6 transition-colors hover:border-navy"
            >
              {project.imageUrl ? (
                <div className="relative aspect-video w-full border border-navy/10">
                  <Image
                    src={project.imageUrl}
                    alt={`Tampilan project ${project.title}`}
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  role="img"
                  aria-label={`Preview visual untuk ${project.title}`}
                  className="flex aspect-video w-full items-center justify-center border border-navy/10 bg-navy-soft text-xs font-semibold uppercase tracking-wider text-paper"
                >
                  Preview Project
                </div>
              )}

              <div className="mt-6 flex flex-1 flex-col">
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="bg-navy/5 px-2.5 py-1 text-xs font-semibold text-gray-blue"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <h3 className="mt-4 text-xl font-bold text-navy">
                  {project.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-6 text-gray-blue">
                  {project.summary}
                </p>

                <div className="mt-6 flex items-center gap-4 border-t border-navy/10 pt-4 text-sm font-bold">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-navy transition-colors hover:text-yellow hover:underline"
                    >
                      Live Demo ↗
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-blue transition-colors hover:text-navy hover:underline"
                    >
                      Source Code ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}