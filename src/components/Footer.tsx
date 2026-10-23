export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-[#1f293d] py-8 text-center text-xs text-slate-500 dark:text-[#64748b]">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Muhammad Adrian Bintang Hariyanto. Built with Next.js &amp; Tailwind CSS.</p>
        <div className="flex items-center gap-4">
          <a href="https://github.com/AdrianBintang29" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors">GitHub</a>
          <span>•</span>
          <a href="https://linkedin.com/in/adrianbintang" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors">LinkedIn</a>
          <span>•</span>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">Top ↑</button>
        </div>
      </div>
    </footer>
  );
}
