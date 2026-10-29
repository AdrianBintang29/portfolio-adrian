import { ArrowUpRight, Copy, FileDown } from 'lucide-react';
import type { ContentData } from '@/lib/content';
import { ProfileCard } from '@/components/ProfileCard';

interface HeroSectionProps {
  text: ContentData;
  copied: boolean;
  onCopyEmail: () => void;
}

function GithubIcon() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

export function HeroSection({ text, copied, onCopyEmail }: HeroSectionProps) {
  return (
    <section className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 dark:bg-teal-500/10 dark:text-teal-300 dark:border-teal-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
              </span>
              {text.badge}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] text-slate-600 dark:text-[#94a3b8]">
              {text.statusTag}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-teal-600 dark:text-[#2FA69A]">{text.role}</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]">{text.name}</h1>
            <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-[#94a3b8]">{text.fullName} · <span className="text-slate-700 dark:text-slate-300">{text.origin}</span></p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 leading-snug">{text.heroHeadline}</h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#94a3b8] leading-relaxed">{text.heroBio}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <a href="/CV-Adrian-Bintang.pdf" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-[#2FA69A] dark:hover:bg-[#268d83] text-white font-medium text-sm transition-all shadow-md active:scale-95 cursor-pointer">
              <FileDown className="w-4 h-4" />
              <span>{text.downloadCv}</span>
            </a>
            <button onClick={onCopyEmail} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#111827] hover:bg-slate-100 dark:hover:bg-[#162033] text-slate-800 dark:text-[#f3f4f6] border border-slate-300/80 dark:border-[#1f293d] hover:border-slate-400 dark:hover:border-[#2d3b55] font-medium text-sm transition-all shadow-xs cursor-pointer">
              <Copy className="w-4 h-4 text-slate-500 dark:text-[#94a3b8]" />
              <span>{copied ? text.copied : text.copyEmail}</span>
            </button>
            <a href="#project" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#162033]/60 hover:bg-slate-200 dark:hover:bg-[#1f293d] text-slate-800 dark:text-[#f3f4f6] border border-slate-200 dark:border-[#1f293d] font-medium text-sm transition-all">
              <span>{text.viewProjects}</span>
              <ArrowUpRight className="w-4 h-4 text-slate-500 dark:text-[#94a3b8]" />
            </a>
            <div className="flex items-center gap-2 sm:ml-auto">
              <a href="https://github.com/AdrianBintang29" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white dark:bg-[#111827] hover:bg-slate-100 dark:hover:bg-[#162033] border border-slate-300/80 dark:border-[#1f293d] text-slate-700 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-white transition-colors shadow-xs" aria-label="GitHub"><GithubIcon /></a>
              <a href="https://linkedin.com/in/adrianbintang" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white dark:bg-[#111827] hover:bg-slate-100 dark:hover:bg-[#162033] border border-slate-300/80 dark:border-[#1f293d] text-slate-700 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-white transition-colors shadow-xs" aria-label="LinkedIn"><LinkedinIcon /></a>
            </div>
          </div>
        </div>

        <ProfileCard text={text} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200/80 dark:border-[#1f293d]">
        {text.stats.map((stat, index) => (
          <div key={index} className="p-3.5 rounded-xl bg-white dark:bg-[#111827]/60 border border-slate-200 dark:border-[#1f293d] shadow-xs">
            <p className="text-xs text-slate-500 dark:text-[#64748b] uppercase tracking-wider font-semibold">{stat.label}</p>
            <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1">{stat.val}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
