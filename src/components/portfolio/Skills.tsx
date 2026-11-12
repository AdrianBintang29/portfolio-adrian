import { getSkillGroups } from '@/lib/db/queries';
import { Reveal } from './Reveal';
import { TechIcon } from './TechIcon';

export async function Skills() {
  const skillGroups = await getSkillGroups();

  return (
    <section id="skills" className="relative bg-bg py-24 md:py-36 border-t border-line overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header Center-Aligned ala Akmal */}
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              Skills & Capabilities
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl md:text-6xl">
              My tech stack
            </h2>
          </div>
        </Reveal>

        {/* 3 Klaster Domain Teknologi dengan Logo Resmi */}
        <div className="mt-16 flex flex-col gap-10">
          {skillGroups.map((group, groupIdx) => (
            <Reveal key={group.category} delayMs={groupIdx * 100}>
              <div className="flex flex-col items-center text-center">
                {/* Category Pill Subtitle */}
                <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/90 px-4 py-1.5 text-xs font-bold tracking-wide text-accent shadow-xs mb-5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                  <span>{group.category}</span>
                </div>

                {/* Badges List with TechIcon SVG */}
                <ul className="flex flex-wrap justify-center gap-3 max-w-4xl">
                  {group.items.map((skill) => (
                    <li
                      key={skill}
                      tabIndex={0}
                      className="group inline-flex items-center gap-3 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-ink shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:text-accent hover:shadow-[0_8px_20px_rgba(37,99,235,0.12)] focus-visible:ring-2 focus-visible:ring-accent cursor-default select-none"
                    >
                      <TechIcon name={skill} className="w-5 h-5 shrink-0" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
