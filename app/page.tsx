'use client';

import React, { useState } from 'react';
import { portfolioContent, Language } from '@/lib/data';
import {
  Code2,
  Layers,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Copy,
  Check,
  ArrowUpRight,
  Terminal,
  Server,
  Activity,
  Zap,
  Mail,
  FolderGit2,
  Download,
  UserCheck,
  MapPin,
  GraduationCap
} from 'lucide-react';

export default function Home() {
  const [lang, setLang] = useState<Language>('id');
  const [copied, setCopied] = useState(false);
  const t = portfolioContent[lang];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(t.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f3f4f6] relative selection:bg-[#2FA69A] selection:text-white w-full overflow-x-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-80 bg-gradient-to-b from-[#2FA69A]/15 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* STICKY NAVBAR - fully responsive */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0b0f19]/85 border-b border-[#1f293d]/80">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Logo & Identity */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2FA69A] to-[#164c47] flex items-center justify-center font-bold text-white text-sm shadow-sm shrink-0">
              A
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 truncate">
              <span className="font-semibold tracking-tight text-white text-sm sm:text-base truncate">
                {t.name}
              </span>
              <span className="text-[#94a3b8] font-normal text-xs truncate">
                / {t.title}
              </span>
            </div>
          </div>

          {/* Badge & Language Selector */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#2FA69A]/10 text-[#5eead4] border border-[#2FA69A]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] animate-pulse" />
              <span>{t.badge}</span>
            </div>

            <div className="flex items-center p-0.5 rounded-lg bg-[#111827] border border-[#1f293d] text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLang('id')}
                className={`px-2 sm:px-2.5 py-1 rounded-md transition-colors ${
                  lang === 'id'
                    ? 'bg-[#2FA69A] text-white shadow-sm'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
                aria-label="Bahasa Indonesia"
              >
                ID
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 sm:px-2.5 py-1 rounded-md transition-colors ${
                  lang === 'en'
                    ? 'bg-[#2FA69A] text-white shadow-sm'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
                aria-label="English Language"
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-12 sm:space-y-16">

        {/* HERO SECTION */}
        <section className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-[#111827] border border-[#1f293d] text-[#94a3b8]">
              <MapPin className="w-3 h-3 text-[#2FA69A]" />
              <span>{t.location}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-[#111827] border border-[#1f293d] text-[#5eead4]">
              <GraduationCap className="w-3.5 h-3.5 text-[#2FA69A]" />
              <span>{t.statusTag}</span>
            </div>
          </div>

          <div>
            <p className="text-xs sm:text-sm font-mono text-[#2FA69A] tracking-wider uppercase mb-1">
              {t.fullName}
            </p>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              {t.heroPitch}
            </h1>
          </div>

          <p className="text-sm sm:text-base md:text-lg text-[#94a3b8] leading-relaxed max-w-2xl">
            {t.heroSub}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-lg bg-[#2FA69A] hover:bg-[#268d83] text-white font-medium text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? t.copied : t.copyEmail}</span>
            </button>

            <a
              href="/CV-Adrian-Bintang.pdf"
              download
              className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-lg bg-[#111827] hover:bg-[#162033] text-[#f3f4f6] border border-[#1f293d] hover:border-[#2d3b55] font-medium text-xs sm:text-sm transition-all"
            >
              <Download className="w-4 h-4 text-[#2FA69A]" />
              <span>{t.downloadCV}</span>
            </a>

            <a
              href="#project"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-lg bg-[#111827] hover:bg-[#162033] text-[#94a3b8] hover:text-white border border-[#1f293d] hover:border-[#2d3b55] font-medium text-xs sm:text-sm transition-all"
            >
              <span>{t.viewWork}</span>
              <ArrowUpRight className="w-4 h-4 text-[#94a3b8]" />
            </a>

            {/* Socials */}
            <div className="flex items-center gap-2 ml-auto">
              <a
                href={t.github}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-[#111827] hover:bg-[#162033] border border-[#1f293d] text-[#94a3b8] hover:text-white transition-colors"
                aria-label="GitHub Adrian Bintang"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href={t.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-[#111827] hover:bg-[#162033] border border-[#1f293d] text-[#94a3b8] hover:text-white transition-colors"
                aria-label="LinkedIn Adrian Bintang"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-3 border-t border-[#1f293d]">
            {t.stats.map((st, idx) => (
              <div key={idx} className="p-2.5 sm:p-3 rounded-lg bg-[#111827]/60 border border-[#1f293d]">
                <p className="text-[10px] sm:text-xs text-[#64748b] uppercase tracking-wider font-semibold">{st.label}</p>
                <p className="text-xs sm:text-sm font-semibold text-white mt-0.5">{st.val}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT & CLIENT COMMITMENT SECTION */}
        <section className="rounded-2xl bg-[#111827] border border-[#1f293d] p-5 sm:p-7 space-y-5">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#2FA69A]" />
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
              {t.aboutTitle}
            </h2>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-semibold text-[#5eead4]">
              {t.aboutRole}
            </h3>
            <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
              {t.aboutBio}
            </p>
          </div>

          {/* Client Commitment Box */}
          <div className="p-4 rounded-xl bg-[#0b0f19] border border-[#2FA69A]/30 space-y-1.5">
            <h4 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2FA69A]" />
              <span>{t.aboutCommitmentTitle}</span>
            </h4>
            <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
              {t.aboutCommitment}
            </p>
          </div>

          {/* Biodata grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#1f293d]">
            {t.profileDetails.map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[#0b0f19]/60 border border-[#1f293d] text-xs">
                <span className="text-[#64748b] block font-mono uppercase text-[10px]">{item.label}</span>
                <span className="text-white font-medium mt-0.5 block">{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CORE CAPABILITIES */}
        <section className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#2FA69A]" />
              {t.capabilitiesTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">{t.capabilitiesSub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
            {t.capabilities.map((cap, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-xl bg-[#111827] border border-[#1f293d] hover:border-[#2FA69A]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-[#2FA69A]/10 text-[#2dd4bf] flex items-center justify-center mb-3">
                    {i === 0 && <Layers className="w-4 h-4" />}
                    {i === 1 && <Activity className="w-4 h-4" />}
                    {i === 2 && <ShieldCheck className="w-4 h-4" />}
                  </div>
                  <h3 className="font-semibold text-white text-sm sm:text-base mb-1.5">{cap.title}</h3>
                  <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed mb-4">{cap.desc}</p>
                </div>
                <ul className="space-y-1.5 border-t border-[#1f293d] pt-3 text-xs text-[#cbd5e1]">
                  {cap.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-1.5">
                      <span className="text-[#2FA69A] font-bold mt-0.5">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURED PROJECT: considrAI */}
        <section id="project" className="space-y-4 sm:space-y-6 scroll-mt-20">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#2FA69A]">
                {t.featuredBadge}
              </span>
              <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-white mt-0.5">
                {t.featuredTitle}
              </h2>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-[#2FA69A]/10 text-[#5eead4] border border-[#2FA69A]/30">
              Live Case
            </span>
          </div>

          <div className="rounded-2xl bg-[#111827] border border-[#1f293d] p-5 sm:p-7 space-y-5">
            <div className="space-y-3">
              <p className="text-xs sm:text-sm md:text-base text-[#cbd5e1] leading-relaxed">
                {t.projectOverview}
              </p>
              <div className="p-3 rounded-lg bg-[#0b0f19] border border-[#1f293d] flex items-start gap-2.5">
                <Cpu className="w-4 h-4 text-[#2FA69A] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-semibold text-white">{t.projectRole}: </span>
                  <span className="text-[#94a3b8]">{t.projectRoleDesc}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-2.5">
                {t.crucialCapabilitiesTitle}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {t.projectHighlights.map((hl, hIdx) => (
                  <div
                    key={hIdx}
                    className="p-3 sm:p-3.5 rounded-lg bg-[#0b0f19]/70 border border-[#1f293d] space-y-1 hover:border-[#2d3b55] transition-colors"
                  >
                    <h4 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2FA69A] shrink-0" />
                      <span>{hl.title}</span>
                    </h4>
                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                      {hl.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#1f293d] pt-3.5 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-[#64748b] font-medium mr-1">Stack:</span>
              {t.projectStack.map((tech, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2 py-0.5 rounded text-[11px] sm:text-xs font-mono bg-[#0b0f19] text-[#5eead4] border border-[#1f293d]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* OTHER PROJECTS SHOWCASE */}
        <section className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#2FA69A]" />
              {t.otherProjectsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {t.otherProjects.map((p, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-xl bg-[#111827] border border-[#1f293d] hover:border-[#2d3b55] transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] sm:text-xs font-mono text-[#2dd4bf] uppercase tracking-wider">{p.category}</span>
                  <h3 className="font-semibold text-white text-sm sm:text-base mt-1 mb-1.5">{p.title}</h3>
                  <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed mb-3">{p.desc}</p>
                  <ul className="space-y-1 mb-4 text-xs text-[#cbd5e1]">
                    {p.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-center gap-1.5">
                        <span className="text-[#2FA69A]">›</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-1.5 border-t border-[#1f293d] pt-3">
                  {p.stack.map((stk, sIdx) => (
                    <span key={sIdx} className="px-2 py-0.5 rounded text-[10px] sm:text-xs font-mono bg-[#0b0f19] text-[#94a3b8] border border-[#1f293d]">
                      {stk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TECH STACK & SERVICES */}
        <section className="space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#2FA69A]" />
                {t.skillsTitle}
              </h2>
              <p className="text-xs sm:text-sm text-[#94a3b8] mt-0.5">{t.skillsSub}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {t.skillCategories.map((grp, gIdx) => (
                <div
                  key={gIdx}
                  className="p-3 sm:p-4 rounded-xl bg-[#111827] border border-[#1f293d] space-y-2"
                >
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#5eead4]">
                    {grp.name}
                  </h3>
                  <ul className="space-y-1 text-xs text-[#cbd5e1] font-mono">
                    {grp.skills.map((it, itIdx) => (
                      <li key={itIdx} className="flex items-center gap-1 truncate">
                        <span className="text-[#64748b]">›</span>
                        <span className="truncate">{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4 pt-4 border-t border-[#1f293d]">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Server className="w-4 h-4 sm:w-5 sm:h-5 text-[#2FA69A]" />
                {t.servicesTitle}
              </h2>
              <p className="text-xs sm:text-sm text-[#94a3b8] mt-0.5">{t.servicesSub}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {t.services.map((srv, sIdx) => (
                <div
                  key={sIdx}
                  className="p-3.5 sm:p-4 rounded-xl bg-[#111827] border border-[#1f293d] space-y-1"
                >
                  <h3 className="text-xs sm:text-sm font-semibold text-white">{srv.title}</h3>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">{srv.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT / CTA */}
        <section className="rounded-2xl bg-gradient-to-b from-[#111827] to-[#0b0f19] border border-[#1f293d] p-6 sm:p-10 text-center space-y-4 sm:space-y-5">
          <div className="max-w-xl mx-auto space-y-1.5">
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-white">
              {t.contactTitle}
            </h2>
            <p className="text-xs sm:text-base text-[#94a3b8]">
              {t.contactSub}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-1">
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg bg-[#2FA69A] hover:bg-[#268d83] text-white font-medium text-xs sm:text-sm transition-all shadow-md cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? t.copied : `${t.copyEmail}`}</span>
            </button>

            <a
              href={`mailto:${t.email}`}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg bg-[#111827] hover:bg-[#162033] border border-[#1f293d] text-white font-medium text-xs sm:text-sm transition-all"
            >
              <Mail className="w-4 h-4 text-[#2FA69A]" />
              <span>{t.email}</span>
            </a>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#1f293d] py-6 sm:py-8 text-center text-xs text-[#64748b]">
        <div className="w-full max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} {t.fullName}. Built with Next.js & Tailwind CSS.</p>
          <div className="flex items-center gap-4">
            <a href={t.github} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              GitHub
            </a>
            <span>•</span>
            <a href={t.linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              LinkedIn
            </a>
            <span>•</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
