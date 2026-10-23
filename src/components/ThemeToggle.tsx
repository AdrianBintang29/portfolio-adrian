import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  mounted: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, mounted, onToggle }: ThemeToggleProps) {
  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={onToggle}
      className="p-2 rounded-lg bg-slate-200/70 hover:bg-slate-300/70 dark:bg-[#111827] dark:hover:bg-[#162033] border border-slate-300/60 dark:border-[#1f293d] text-slate-700 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
    </button>
  );
}
