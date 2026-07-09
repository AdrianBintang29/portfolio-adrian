"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="max-w-2xl mx-auto px-6 py-6">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-stone-800 dark:text-white">Adrian Bintang</span>

        {/* Menu untuk layar besar */}
        <div className="hidden sm:flex gap-6 text-sm text-stone-600 dark:text-gray-300">
          <a href="#about" className="hover:text-amber-600 dark:hover:text-cyan-400 transition-colors">Tentang</a>
          <a href="#skills" className="hover:text-amber-600 dark:hover:text-cyan-400 transition-colors">Keahlian</a>
          <a href="#experience" className="hover:text-amber-600 dark:hover:text-cyan-400 transition-colors">Pengalaman</a>
          <a href="#projects" className="hover:text-amber-600 dark:hover:text-cyan-400 transition-colors">Proyek</a>
          <a href="#contact" className="hover:text-amber-600 dark:hover:text-cyan-400 transition-colors">Kontak</a>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Tombol hamburger, cuma muncul di layar kecil */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden p-2 text-stone-700 dark:text-gray-300"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menu dropdown untuk layar kecil, cuma muncul kalau isOpen true */}
      {isOpen && (
        <div className="sm:hidden mt-4 flex flex-col gap-3 text-sm text-stone-600 dark:text-gray-300">
          <a href="#about" onClick={() => setIsOpen(false)} className="hover:text-amber-600 dark:hover:text-cyan-400 transition-colors">Tentang</a>
          <a href="#skills" onClick={() => setIsOpen(false)} className="hover:text-amber-600 dark:hover:text-cyan-400 transition-colors">Keahlian</a>
          <a href="#experience" onClick={() => setIsOpen(false)} className="hover:text-amber-600 dark:hover:text-cyan-400 transition-colors">Pengalaman</a>
          <a href="#projects" onClick={() => setIsOpen(false)} className="hover:text-amber-600 dark:hover:text-cyan-400 transition-colors">Proyek</a>
          <a href="#contact" onClick={() => setIsOpen(false)} className="hover:text-amber-600 dark:hover:text-cyan-400 transition-colors">Kontak</a>
        </div>
      )}
    </nav>
  );
}