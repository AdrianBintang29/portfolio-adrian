import Image from 'next/image';

interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  imageUrl?: string | null;
  liveUrl?: string | null;
  repoUrl?: string | null;
  stack: string[];
}

export function ProjectCard({ project }: { project: ProjectItem }) {
  return (
    <article
      tabIndex={0}
      className="group relative flex h-full min-h-[460px] w-[320px] sm:w-[380px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-3xl border border-line bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-accent hover:shadow-[0_12px_28px_rgba(28,25,23,0.08)] focus-visible:ring-2 focus-visible:ring-accent"
    >
      {/* 1. BAGIAN ATAS: Thumbnail & Detail Judul/Deskripsi */}
      <div className="flex flex-col flex-1">
        {/* Cover Preview */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-surface-raised border border-line/50 shrink-0">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={`Pratinjau visual untuk ${project.title}`}
              fill
              unoptimized
              sizes="(max-width: 768px) 320px, 380px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col justify-between p-6 bg-gradient-to-br from-surface to-surface-raised">
              <span className="font-mono text-xs text-muted">
                {project.slug}
              </span>

              <div className="text-center py-4">
                <span className="text-2xl text-accent font-bold">#</span>
                <p className="mt-1 text-xs font-bold tracking-wider text-muted uppercase">
                  Standalone System
                </p>
              </div>

              <div className="text-right text-[11px] text-muted/80">
                Docker Container Node
              </div>
            </div>
          )}
        </div>

        {/* Judul & Deskripsi dengan ruang proporsional */}
        <div className="mt-5 flex flex-col flex-1">
          <h3 className="text-xl font-bold tracking-tight text-ink group-hover:text-accent transition-colors">
            {project.title}
          </h3>

          <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted line-clamp-3 min-h-[3.6rem]">
            {project.summary}
          </p>
        </div>
      </div>

      {/* 2. BAGIAN BAWAH (Dikunci Sejajar di Bawah dengan mt-auto) */}
      <div className="mt-6 flex flex-col justify-end">
        {/* Stack Tags */}
        <div className="flex flex-wrap gap-1.5 min-h-[2rem] items-center">
          {project.stack.map((item) => (
            <span
              key={item}
              className="rounded-lg border border-line bg-surface-raised px-2.5 py-1 text-[11px] font-semibold text-muted"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Direct Action Links Sejajar Sempurna */}
        <div className="mt-5 flex items-center gap-5 border-t border-line/60 pt-4 text-xs font-bold">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-accent hover:underline underline-offset-4"
            >
              <span>Live Demo</span>
              <span aria-hidden="true">↗</span>
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-ink"
            >
              <span>Repository</span>
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
