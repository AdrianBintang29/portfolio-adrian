'use client';

import React, { useState, useEffect } from 'react';
import { content, Language } from '@/lib/content';
import {
  Code2,
  Layers,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  ArrowUpRight,
  Server,
  Activity,
  Zap,
  Mail,
  Sun,
  Moon,
  Boxes,
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

  const getDomainStyle = (tech: string) => {
    const lower = tech.toLowerCase();
    if (['next.js', 'react', 'typescript', 'tailwind css', 'javascript', 'html/css'].some(k => lower.includes(k))) {
      return 'bg-teal-50 text-teal-700 border-teal-200/80 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/40';
    }
    if (['go', 'fiber', 'python', 'restful', 'data normalization'].some(k => lower.includes(k))) {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/40';
    }
    if (['postgres', 'sql', 'jwt', 'oauth', 'role-based'].some(k => lower.includes(k))) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40';
    }
    return 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40';
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

      {/* Top sticky nav */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-50/85 dark:bg-[#0b0f19]/85 border-b border-slate-200/80 dark:border-[#1f293d]/80 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-600 to-teal-800 dark:from-[#2FA69A] dark:to-[#164c47] flex items-center justify-center font-bold text-white text-sm shadow-sm">
              A
            </div>
            <span className="font-semibold tracking-tight text-slate-900 dark:text-white text-sm sm:text-base">
              {t.name} <span className="text-slate-500 dark:text-[#94a3b8] font-normal text-xs sm:text-sm hidden sm:inline">/ {t.role}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Availability pill */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-800 border border-teal-200 dark:bg-[#2FA69A]/10 dark:text-[#5eead4] dark:border-[#2FA69A]/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              {t.badge}
            </div>

            {/* Language Switcher */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-200/70 dark:bg-[#111827] border border-slate-300/60 dark:border-[#1f293d] text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLang('id')}
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
                onClick={() => setLang('en')}
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

            {/* Theme Toggle Button */}
            {mounted && (
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-200/70 hover:bg-slate-300/70 dark:bg-[#111827] dark:hover:bg-[#162033] border border-slate-300/60 dark:border-[#1f293d] text-slate-700 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>
            )}
          </div>
        </div>
      </header>

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

        {/* WHAT I CAN DO / SERVICES */}
        <section id="services" className="space-y-6 scroll-mt-24">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-teal-600 dark:text-[#2FA69A]" />
              {t.servicesTitle}
            </h2>
            <p className="text-sm text-slate-600 dark:text-[#94a3b8] mt-1">{t.servicesSub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.servicesList.map((srv, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] hover:border-teal-500/50 dark:hover:border-[#2FA69A]/40 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-[#2FA69A]/10 text-teal-700 dark:text-[#2dd4bf] flex items-center justify-center mb-4 border border-teal-100 dark:border-teal-500/20">
                    {i === 0 && <Layers className="w-4 h-4" />}
                    {i === 1 && <Server className="w-4 h-4" />}
                    {i === 2 && <ShieldCheck className="w-4 h-4" />}
                    {i === 3 && <Activity className="w-4 h-4" />}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">{srv.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-[#94a3b8] leading-relaxed mb-4">{srv.desc}</p>
                </div>
                <ul className="space-y-2 border-t border-slate-100 dark:border-[#1f293d] pt-3 text-xs text-slate-600 dark:text-[#94a3b8]">
                  {srv.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="text-teal-600 dark:text-[#2FA69A] font-bold mt-0.5">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURED PROJECT: considrAI */}
        <section id="project" className="space-y-6 scroll-mt-24">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-[#2FA69A]">
                {t.featuredBadge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
                {t.projectTitle}
              </h2>
              <p className="text-sm text-slate-600 dark:text-[#94a3b8] mt-0.5">{t.projectSubtitle}</p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              {t.projectDemoUrl && (
                <a
                  href={t.projectDemoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors"
                >
                  <span>Live Case</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Big Featured Card */}
          <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm hover:border-teal-500/30 dark:hover:border-[#2FA69A]/30 transition-all p-6 sm:p-8 space-y-6">
            {/* Summary & Role */}
            <div className="space-y-3">
              <p className="text-sm sm:text-base text-slate-700 dark:text-[#cbd5e1] leading-relaxed">
                {t.projectSummary}
              </p>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-200/90 dark:border-[#1f293d] flex items-start gap-3">
                <Cpu className="w-4 h-4 text-teal-600 dark:text-[#2FA69A] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-semibold text-slate-900 dark:text-white">{t.projectRole}: </span>
                  <span className="text-slate-600 dark:text-[#94a3b8]">{t.projectRoleDesc}</span>
                </div>
              </div>
            </div>

              {/* Key Capabilities */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#94a3b8] mb-3">
                  {t.keyCapabilitiesTitle}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {t.projectHighlights.map((hl, hIdx) => (
                    <div
                      key={hIdx}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-[#0b0f19]/70 border border-slate-200/90 dark:border-[#1f293d] space-y-1 hover:border-teal-500/30 dark:hover:border-[#2d3b55] transition-colors"
                    >
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-[#2FA69A] shrink-0" />
                        {hl.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-[#94a3b8] leading-relaxed">
                        {hl.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="border-t border-slate-200/80 dark:border-[#1f293d] pt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-[#64748b] font-medium mr-1">Stack:</span>
                {t.projectStack.map((tech, sIdx) => (
                  <span
                    key={sIdx}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono border ${getDomainStyle(tech)}`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
          </div>

          {/* Secondary Projects Bento Grid */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Boxes className="w-4 h-4 text-teal-600 dark:text-[#2FA69A]" />
              {t.secondaryProjectsTitle}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {t.secondaryProjects.map((proj, pIdx) => (
                <div
                  key={pIdx}
                  className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] hover:border-teal-500/40 dark:hover:border-[#2FA69A]/40 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-teal-600 dark:text-[#5eead4]">
                        {proj.badge}
                      </span>
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                          aria-label="GitHub Repository"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                          </svg>
                        </a>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{proj.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-[#94a3b8] leading-relaxed">{proj.desc}</p>
                    
                    <ul className="space-y-1.5 pt-2 text-xs text-slate-600 dark:text-[#94a3b8]">
                      {proj.points.map((pt, ptIdx) => (
                        <li key={ptIdx} className="flex items-center gap-2">
                          <span className="text-teal-600 dark:text-teal-400 font-bold">›</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-slate-100 dark:border-[#1f293d] pt-4 mt-5 flex flex-wrap items-center gap-1.5">
                    {proj.stack.map((stk, stkIdx) => (
                      <span
                        key={stkIdx}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-mono border ${getDomainStyle(stk)}`}
                      >
                        {stk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TECH STACK */}
        <section id="skills" className="space-y-6 scroll-mt-24">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-teal-600 dark:text-[#2FA69A]" />
              {t.skillsTitle}
            </h2>
            <p className="text-sm text-slate-600 dark:text-[#94a3b8] mt-1">{t.skillsSub}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {t.skillGroups.map((grp, gIdx) => (
              <div
                key={gIdx}
                className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] space-y-3 shadow-xs"
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-[#5eead4]">
                  {grp.title}
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-[#cbd5e1] font-mono">
                  {grp.items.map((it, itIdx) => (
                    <li key={itIdx} className="flex items-center gap-1.5">
                      <span className="text-slate-400 dark:text-[#64748b]">›</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA / CONTACT */}
        <section className="rounded-3xl bg-gradient-to-b from-white to-slate-100 dark:from-[#111827] dark:to-[#0b0f19] border border-slate-200 dark:border-[#1f293d] p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t.ctaTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#94a3b8]">
              {t.ctaSub}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-[#2FA69A] dark:hover:bg-[#268d83] text-white font-medium text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? t.copied : `${t.copyEmail} (${emailAddress})`}</span>
            </button>

            <a
              href={`mailto:${emailAddress}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-[#111827] hover:bg-slate-100 dark:hover:bg-[#162033] border border-slate-300 dark:border-[#1f293d] text-slate-800 dark:text-white font-medium text-sm transition-all shadow-xs"
            >
              <Mail className="w-4 h-4 text-teal-600 dark:text-[#2FA69A]" />
              <span>Direct Email</span>
            </a>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-[#1f293d] py-8 text-center text-xs text-slate-500 dark:text-[#64748b]">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Muhammad Adrian Bintang Hariyanto. Built with Next.js & Tailwind CSS.</p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/AdrianBintang29" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              GitHub
            </a>
            <span>•</span>
            <a href="https://linkedin.com/in/adrianbintang" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              LinkedIn
            </a>
            <span>•</span>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              Top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
