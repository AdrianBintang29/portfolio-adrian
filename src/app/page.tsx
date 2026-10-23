'use client';

import React, { useState, useEffect } from 'react';
import { content, Language } from '@/lib/content';
import { Header } from '@/components/Header';
import { ServicesSection } from '@/components/ServicesSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { TechStackSection } from '@/components/TechStackSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import {
  ArrowUpRight,
  Copy,
  Check,
  FileDown
} from 'lucide-react';

export default function PortfolioPage() {
  const [lang, setLang] = useState<Language>('id');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = content[lang];

  const emailAddress = "adrianbintang29@gmail.com";

  useEffect(() => {
    setMounted(true);
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0f19] dark:text-[#f3f4f6] font-sans antialiased relative selection:bg-[#0d9488] dark:selection:bg-[#2FA69A] selection:text-white transition-colors duration-150 overflow-x-hidden">
      
      {/* Lightweight ambient background - static & GPU friendly */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none -z-20 opacity-60 [mask-image:linear-gradient(to_bottom,white_30%,transparent_90%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[700px] h-[260px] bg-teal-500/10 dark:bg-[#2FA69A]/10 rounded-full blur-2xl pointer-events-none -z-10 transform-gpu" />

      {/* Floating Toast Notification */}
      <div
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-teal-500 dark:text-slate-950 font-medium text-xs sm:text-sm shadow-2xl transition-all duration-300 ${
          copied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <Check className="w-4 h-4 text-teal-400 dark:text-slate-950 shrink-0" />
        <span>{lang === 'id' ? 'Email berhasil disalin!' : 'Email copied to clipboard!'}</span>
      </div>

      <Header
        content={t}
        lang={lang}
        isDark={isDark}
        mounted={mounted}
        onLanguageChange={setLang}
        onThemeToggle={toggleTheme}
      />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-20">
        
        {/* HERO SECTION - Personal First */}
        <section className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Personal Intro */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Status pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 dark:bg-teal-500/10 dark:text-teal-300 dark:border-teal-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                  </span>
                  {t.badge}
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] text-slate-600 dark:text-[#94a3b8]">
                  <span>{t.statusTag}</span>
                </span>
              </div>

              {/* Name & Role Primary Focal Point */}
              <div className="space-y-1">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-teal-600 dark:text-[#2FA69A]">
                  {t.role}
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]">
                  {t.name}
                </h1>
                <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-[#94a3b8]">
                  {t.fullName} · <span className="text-slate-700 dark:text-slate-300">{t.origin}</span>
                </p>
              </div>

              {/* Headline & Concise Bio */}
              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 leading-snug">
                  {t.heroHeadline}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-[#94a3b8] leading-relaxed">
                  {t.heroBio}
                </p>
              </div>

              {/* Actions & Links */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <a
                  href="/CV-Adrian-Bintang.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-[#2FA69A] dark:hover:bg-[#268d83] text-white font-medium text-sm transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <FileDown className="w-4 h-4" />
                  <span>{t.downloadCv}</span>
                </a>

                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#111827] hover:bg-slate-100 dark:hover:bg-[#162033] text-slate-800 dark:text-[#f3f4f6] border border-slate-300/80 dark:border-[#1f293d] hover:border-slate-400 dark:hover:border-[#2d3b55] font-medium text-sm transition-all shadow-xs cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-slate-500 dark:text-[#94a3b8]" />
                  <span>{copied ? t.copied : t.copyEmail}</span>
                </button>

                <a
                  href="#project"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#162033]/60 hover:bg-slate-200 dark:hover:bg-[#1f293d] text-slate-800 dark:text-[#f3f4f6] border border-slate-200 dark:border-[#1f293d] font-medium text-sm transition-all"
                >
                  <span>{t.viewProjects}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 dark:text-[#94a3b8]" />
                </a>

                <div className="flex items-center gap-2 sm:ml-auto">
                  <a
                    href="https://github.com/AdrianBintang29"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-white dark:bg-[#111827] hover:bg-slate-100 dark:hover:bg-[#162033] border border-slate-300/80 dark:border-[#1f293d] text-slate-700 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-white transition-colors shadow-xs"
                    aria-label="GitHub"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com/in/adrianbintang"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-white dark:bg-[#111827] hover:bg-slate-100 dark:hover:bg-[#162033] border border-slate-300/80 dark:border-[#1f293d] text-slate-700 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-white transition-colors shadow-xs"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Identity Spec Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-xl overflow-hidden hover:border-teal-500/40 dark:hover:border-[#2FA69A]/40 transition-all">
                {/* Card window header */}
                <div className="px-4 py-3 bg-slate-100/70 dark:bg-[#0e1422] border-b border-slate-200/80 dark:border-[#1f293d] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="ml-2 text-xs font-mono text-slate-500 dark:text-[#64748b]">engineer.identity</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-teal-700 dark:text-teal-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                    verified
                  </span>
                </div>

                {/* Identity content */}
                <div className="p-5 space-y-3.5">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-[#1f293d]">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 dark:from-[#2FA69A] dark:to-[#164c47] flex items-center justify-center font-bold text-white text-lg shadow-sm">
                      AB
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                        {t.name}
                      </h3>
                      <p className="text-xs font-mono text-teal-700 dark:text-[#5eead4]">
                        Next.js · Go · PostgreSQL
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {t.profileCard.items.map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-3">
                        <span className="text-slate-400 dark:text-[#64748b] font-medium shrink-0">
                          {item.label}
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200 text-right">
                          {item.val}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-[#1f293d] flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-[#64748b]">
                    <span>STATUS: ACTIVE</span>
                    <span className="text-emerald-600 dark:text-emerald-400">AVAILABLE FOR WORK</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Quick metric stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200/80 dark:border-[#1f293d]">
            {t.stats.map((st, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white dark:bg-[#111827]/60 border border-slate-200 dark:border-[#1f293d] shadow-xs"
              >
                <p className="text-xs text-slate-500 dark:text-[#64748b] uppercase tracking-wider font-semibold">{st.label}</p>
                <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1">{st.val}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bagian solusi menjelaskan kemampuan yang dapat ditawarkan sebelum bukti proyek. */}
        <ServicesSection text={t} />

        <ProjectsSection text={t} />

        <TechStackSection text={t} />

        <ContactSection text={t} email={emailAddress} copied={copied} onCopyEmail={handleCopyEmail} />

      </main>

      <Footer />
    </div>
  );
}
