import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import EducationSection from "@/components/EducationSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

export default function Home() {
  return (
     <main className="min-h-screen bg-orange-50 dark:bg-neutral-900 transition-colors">
      <Navbar />
      <HeroSection />

      <FadeIn>
        <AboutSection />
      </FadeIn>
      
      <FadeIn>
        <ProjectsSection />
      </FadeIn>

      <FadeIn>
        <SkillsSection />
      </FadeIn>

      <FadeIn>
        <ExperienceSection />
      </FadeIn>

      <FadeIn>
        <EducationSection />
      </FadeIn>

      <FadeIn>
        <ContactSection />
      </FadeIn>

      <Footer />
    </main>
  );
}