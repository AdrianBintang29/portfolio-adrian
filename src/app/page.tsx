import { getProfile } from '@/lib/db/queries';
import { About } from '@/components/portfolio/About';
import { Contact } from '@/components/portfolio/Contact';
import { Experience } from '@/components/portfolio/Experience';
import { Footer } from '@/components/portfolio/Footer';
import { Header } from '@/components/portfolio/Header';
import { Hero } from '@/components/portfolio/Hero';
import { Projects } from '@/components/portfolio/Projects';
import { Skills } from '@/components/portfolio/Skills';

export default async function PortfolioPage() {
  const profile = await getProfile();

  return (
    <div className="relative min-h-[100dvh] bg-bg text-ink">
      <Header />

      <main id="top">
        <Hero profile={profile} />
        <Projects />
        <Experience />
        <About />
        <Skills />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
