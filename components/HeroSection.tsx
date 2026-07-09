export default function HeroSection() {
  return (
    <section className="max-w-2xl mx-auto pt-24 pb-4 text-center">
      <h1 className="text-6xl sm:text-7xl font-bold text-stone-800 dark:text-white font-[family-name:var(--font-playfair)]">
        Adrian Bintang
      </h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Mahasiswa Informatika | Fullstack Developer</p>
      <div className="mt-6 flex justify-center gap-3">
        <span className="px-3 py-1 bg-blue-100 dark:bg-cyan-950 text-blue-700 dark:text-cyan-400 rounded-full text-xs font-medium dark:border dark:border-cyan-800 hover:scale-110 transition-transform cursor-default">Next.js</span>
        <span className="px-3 py-1 bg-green-100 dark:bg-cyan-950 text-green-700 dark:text-cyan-400 rounded-full text-xs font-medium dark:border dark:border-cyan-800 hover:scale-110 transition-transform cursor-default">Tailwind</span>
        <span className="px-3 py-1 bg-purple-100 dark:bg-fuchsia-950 text-purple-700 dark:text-fuchsia-400 rounded-full text-xs font-medium dark:border dark:border-fuchsia-800 hover:scale-110 transition-transform cursor-default">Go</span>
      </div>
      <a
        href="/CV-Adrian-Bintang.pdf"
        download
        className="mt-8 inline-block px-6 py-3 bg-stone-800 dark:bg-cyan-500 text-white rounded-lg text-sm font-medium hover:bg-stone-900 dark:hover:bg-cyan-400 dark:hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all"
      >
        Download CV
      </a>
    </section>
  );
}