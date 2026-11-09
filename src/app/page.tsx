import { Header } from '@/components/portfolio/Header';
import { Hero } from '@/components/portfolio/Hero';
import { Projects } from '@/components/portfolio/Projects';
import { About } from '@/components/portfolio/About';
import { Skills } from '@/components/portfolio/Skills';
import { Contact } from '@/components/portfolio/Contact';
import { Footer } from '@/components/portfolio/Footer';

export default function PortfolioPage() {
  return (
    <>
      <Header />

      <main id="top">
        <Hero />
        <Projects />
        <About />
        <Skills />
        <Contact />
        <Footer />
      </main>
    </>
  );
}