'use client';

import { useEffect, useState } from 'react';
import { content, type Language } from '@/lib/content';

const EMAIL_ADDRESS = 'adrianbintang29@gmail.com';

export function usePortfolioPage() {
  const [lang, setLang] = useState<Language>('id');
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
    localStorage.setItem('theme', nextDark ? 'dark' : 'light');
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Hook ini menjadi penghubung state halaman dengan seluruh komponen tampilan.
  return {
    text: content[lang],
    lang,
    setLang,
    isDark,
    mounted,
    copied,
    email: EMAIL_ADDRESS,
    toggleTheme,
    copyEmail,
  };
}
