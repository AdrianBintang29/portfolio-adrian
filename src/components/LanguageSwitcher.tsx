import type { Language } from '@/lib/content';

interface LanguageSwitcherProps {
  lang: Language;
  onChange: (language: Language) => void;
}

export function LanguageSwitcher({ lang, onChange }: LanguageSwitcherProps) {
  return (
    <div className="flex items-center p-0.5 rounded-lg bg-slate-200/70 dark:bg-[#111827] border border-slate-300/60 dark:border-[#1f293d] text-xs font-semibold">
      <button
        type="button"
        onClick={() => onChange('id')}
        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
          lang === 'id'
            ? 'bg-white text-teal-700 shadow-xs dark:bg-[#2FA69A] dark:text-white'
            : 'text-slate-600 hover:text-slate-900 dark:text-[#94a3b8] dark:hover:text-white'
        }`}
        aria-label="Bahasa Indonesia"
      >
        ID
      </button>
      <button
        type="button"
        onClick={() => onChange('en')}
        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
          lang === 'en'
            ? 'bg-white text-teal-700 shadow-xs dark:bg-[#2FA69A] dark:text-white'
            : 'text-slate-600 hover:text-slate-900 dark:text-[#94a3b8] dark:hover:text-white'
        }`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
