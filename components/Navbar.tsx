import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="max-w-2xl mx-auto px-6 py-6 flex justify-between items-center">
      <span className="font-semibold text-stone-800">Adrian Bintang</span>
      <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-stone-600">
        <a href="#about" className="hover:text-amber-600 transition-colors">Tentang</a>
        <a href="#skills" className="hover:text-amber-600 transition-colors">Keahlian</a>
        <a href="#experience" className="hover:text-amber-600 transition-colors">Pengalaman</a>
        <a href="#projects" className="hover:text-amber-600 transition-colors">Proyek</a>
        <a href="#contact" className="hover:text-amber-600 transition-colors">Kontak</a>
      </div>
      <ThemeToggle />
    </nav>
  );
}