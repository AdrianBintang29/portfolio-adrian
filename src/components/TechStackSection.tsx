import { Code2 } from 'lucide-react';
import type { ContentData } from '@/lib/content';

interface TechStackSectionProps {
  text: ContentData;
}

export function TechStackSection({ text }: TechStackSectionProps) {
  return (
    <section id="skills" className="space-y-6 scroll-mt-24">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Code2 className="w-5 h-5 text-teal-600 dark:text-[#2FA69A]" />
          {text.skillsTitle}
        </h2>
        <p className="text-sm text-slate-600 dark:text-[#94a3b8] mt-1">{text.skillsSub}</p>
      </div>

      {/* Stack dikelompokkan agar hubungan teknologi dan kemampuan lebih mudah dibaca. */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {text.skillGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] space-y-3 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-[#5eead4]">{group.title}</h3>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-[#cbd5e1] font-mono">
              {group.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-center gap-1.5">
                  <span className="text-slate-400 dark:text-[#64748b]">›</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
