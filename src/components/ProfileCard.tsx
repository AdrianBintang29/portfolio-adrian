import type { ContentData } from '@/lib/content';

interface ProfileCardProps {
  text: ContentData;
}

export function ProfileCard({ text }: ProfileCardProps) {
  return (
    <div className="lg:col-span-5">
      <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-xl overflow-hidden hover:border-teal-500/40 dark:hover:border-[#2FA69A]/40 transition-all">
        <div className="px-4 py-3 bg-slate-100/70 dark:bg-[#0e1422] border-b border-slate-200/80 dark:border-[#1f293d] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 text-xs font-mono text-slate-500 dark:text-[#64748b]">engineer.identity</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-teal-700 dark:text-teal-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            verified
          </span>
        </div>

        <div className="p-5 space-y-3.5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-[#1f293d]">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 dark:from-[#2FA69A] dark:to-[#164c47] flex items-center justify-center font-bold text-white text-lg shadow-sm">AB</div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{text.name}</h3>
              <p className="text-xs font-mono text-teal-700 dark:text-[#5eead4]">Next.js · Go · PostgreSQL</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            {text.profileCard.items.map((item, index) => (
              <div key={index} className="flex items-start justify-between gap-3">
                <span className="text-slate-400 dark:text-[#64748b] font-medium shrink-0">{item.label}</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 text-right">{item.val}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-[#1f293d] flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-[#64748b]">
            <span>STATUS: ACTIVE</span>
            <span className="text-emerald-600 dark:text-emerald-400">AVAILABLE FOR WORK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
