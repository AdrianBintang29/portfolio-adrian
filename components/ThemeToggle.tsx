"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-full bg-gray-100 dark:bg-neutral-800 dark:border dark:border-cyan-800 text-gray-700 dark:text-cyan-400 hover:bg-gray-200 dark:hover:border-cyan-400 dark:hover:shadow-[0_0_12px_rgba(34,211,238,0.5)] transition-all"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}