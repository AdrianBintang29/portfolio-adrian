import { content, Language } from '@/lib/content';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HeaderProps {
  content: (typeof content)[Language];
  lang: Language;
  isDark: boolean;
  mounted: boolean;
  onLanguageChange: (language: Language) => void;
  onThemeToggle: () => void;
}

export function Header({
  content: text,
  lang,
  isDark,
  mounted,
  onLanguageChange,
  onThemeToggle,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-50/85 dark:bg-[#0b0f19]/85 border-b border-slate-200/80 dark:border-[#1f293d]/80 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-600 to-teal-800 dark:from-[#2FA69A] dark:to-[#164c47] flex items-center justify-center font-bold text-white text-sm shadow-sm">
            A
          </div>
          <span className="font-semibold tracking-tight text-slate-900 dark:text-white text-sm sm:text-base">
            {text.name}{' '}
            <span className="text-slate-500 dark:text-[#94a3b8] font-normal text-xs sm:text-sm hidden sm:inline">
              / {text.role}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Header menampilkan status ketersediaan sebelum pengunjung masuk ke konten. */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-800 border border-teal-200 dark:bg-[#2FA69A]/10 dark:text-[#5eead4] dark:border-[#2FA69A]/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
            </span>
            {text.badge}
          </div>

          <LanguageSwitcher lang={lang} onChange={onLanguageChange} />
          <ThemeToggle isDark={isDark} mounted={mounted} onToggle={onThemeToggle} />
        </div>
      </div>
    </header>
  );
}
