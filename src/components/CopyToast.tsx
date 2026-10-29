import { Check } from 'lucide-react';
import type { Language } from '@/lib/content';

interface CopyToastProps {
  copied: boolean;
  lang: Language;
}

export function CopyToast({ copied, lang }: CopyToastProps) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-teal-500 dark:text-slate-950 font-medium text-xs sm:text-sm shadow-2xl transition-all duration-300 ${
        copied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <Check className="w-4 h-4 text-teal-400 dark:text-slate-950 shrink-0" />
      <span>{lang === 'id' ? 'Email berhasil disalin!' : 'Email copied to clipboard!'}</span>
    </div>
  );
}
