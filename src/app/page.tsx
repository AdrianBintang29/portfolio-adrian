'use client';

import { AmbientBackground } from '@/components/AmbientBackground';
import { ContactSection } from '@/components/ContactSection';
import { CopyToast } from '@/components/CopyToast';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { ServicesSection } from '@/components/ServicesSection';
import { TechStackSection } from '@/components/TechStackSection';
import { usePortfolioPage } from '@/hooks/usePortfolioPage';

export default function PortfolioPage() {
  const portfolio = usePortfolioPage();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0f19] dark:text-[#f3f4f6] font-sans antialiased relative selection:bg-[#0d9488] dark:selection:bg-[#2FA69A] selection:text-white transition-colors duration-150 overflow-x-hidden">
      <AmbientBackground />
      <CopyToast copied={portfolio.copied} lang={portfolio.lang} />
      <Header
        content={portfolio.text}
        lang={portfolio.lang}
        isDark={portfolio.isDark}
        mounted={portfolio.mounted}
        onLanguageChange={portfolio.setLang}
        onThemeToggle={portfolio.toggleTheme}
      />

      {/* Urutan komponen di bawah sama dengan urutan yang dilihat pengunjung. */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-20">
        <HeroSection text={portfolio.text} copied={portfolio.copied} onCopyEmail={portfolio.copyEmail} />
        <ServicesSection text={portfolio.text} />
        <ProjectsSection text={portfolio.text} />
        <TechStackSection text={portfolio.text} />
        <ContactSection text={portfolio.text} email={portfolio.email} copied={portfolio.copied} onCopyEmail={portfolio.copyEmail} />
      </main>

      <Footer />
    </div>
  );
}
