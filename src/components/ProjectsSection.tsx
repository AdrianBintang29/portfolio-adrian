import { Boxes, CheckCircle2, Cpu, ExternalLink } from 'lucide-react';
import type { ContentData } from '@/lib/content';

interface ProjectsSectionProps {
  text: ContentData;
}

function getDomainStyle(tech: string) {
  const lower = tech.toLowerCase();

  if (['next.js', 'react', 'typescript', 'tailwind css', 'javascript', 'html/css'].some((key) => lower.includes(key))) {
    return 'bg-teal-50 text-teal-700 border-teal-200/80 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/40';
  }

  if (['go', 'fiber', 'python', 'restful', 'data normalization'].some((key) => lower.includes(key))) {
    return 'bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/40';
  }

  if (['postgres', 'sql', 'jwt', 'oauth', 'role-based'].some((key) => lower.includes(key))) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40';
  }

  return 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40';
}

function GithubIcon() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function ProjectsSection({ text }: ProjectsSectionProps) {
  return (
    <section id="project" className="space-y-6 scroll-mt-24">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-[#2FA69A]">
            {text.featuredBadge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            {text.projectTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-[#94a3b8] mt-0.5">{text.projectSubtitle}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          {text.projectDemoUrl && (
            <a
              href={text.projectDemoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors"
            >
              <span>Live Case</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Data project dipisahkan dari page agar alur halaman utama mudah dibaca. */}
      <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm hover:border-teal-500/30 dark:hover:border-[#2FA69A]/30 transition-all p-6 sm:p-8 space-y-6">
        <div className="space-y-3">
          <p className="text-sm sm:text-base text-slate-700 dark:text-[#cbd5e1] leading-relaxed">{text.projectSummary}</p>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-200/90 dark:border-[#1f293d] flex items-start gap-3">
            <Cpu className="w-4 h-4 text-teal-600 dark:text-[#2FA69A] shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <span className="font-semibold text-slate-900 dark:text-white">{text.projectRole}: </span>
              <span className="text-slate-600 dark:text-[#94a3b8]">{text.projectRoleDesc}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#94a3b8] mb-3">{text.keyCapabilitiesTitle}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {text.projectHighlights.map((highlight, index) => (
              <div key={index} className="p-4 rounded-xl bg-slate-50 dark:bg-[#0b0f19]/70 border border-slate-200/90 dark:border-[#1f293d] space-y-1 hover:border-teal-500/30 dark:hover:border-[#2d3b55] transition-colors">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-[#2FA69A] shrink-0" />
                  {highlight.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-[#94a3b8] leading-relaxed">{highlight.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200/80 dark:border-[#1f293d] pt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-[#64748b] font-medium mr-1">Stack:</span>
          {text.projectStack.map((tech, index) => (
            <span key={index} className={`px-2.5 py-1 rounded-lg text-xs font-mono border ${getDomainStyle(tech)}`}>{tech}</span>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Boxes className="w-4 h-4 text-teal-600 dark:text-[#2FA69A]" />
          {text.secondaryProjectsTitle}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {text.secondaryProjects.map((project, index) => (
            <div key={index} className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] hover:border-teal-500/40 dark:hover:border-[#2FA69A]/40 transition-all flex flex-col justify-between shadow-xs hover:shadow-md">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-teal-600 dark:text-[#5eead4]">{project.badge}</span>
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors" aria-label="GitHub Repository">
                      <GithubIcon />
                    </a>
                  )}
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{project.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#94a3b8] leading-relaxed">{project.desc}</p>
                <ul className="space-y-1.5 pt-2 text-xs text-slate-600 dark:text-[#94a3b8]">
                  {project.points.map((point, pointIndex) => <li key={pointIndex} className="flex items-center gap-2"><span className="text-teal-600 dark:text-teal-400 font-bold">›</span><span>{point}</span></li>)}
                </ul>
              </div>
              <div className="border-t border-slate-100 dark:border-[#1f293d] pt-4 mt-5 flex flex-wrap items-center gap-1.5">
                {project.stack.map((tech, techIndex) => <span key={techIndex} className={`px-2 py-0.5 rounded-md text-[11px] font-mono border ${getDomainStyle(tech)}`}>{tech}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
