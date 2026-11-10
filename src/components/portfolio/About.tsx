import { getProfile } from '@/lib/db/queries';
import { splitParagraphs } from '@/lib/text';

export async function About() {
  const profile = await getProfile();
  const paragraphs = splitParagraphs(profile.aboutBody);

  return (
    <section id="about" className="border-t border-gray-blue/20 bg-paper py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
        <div
          role="img"
          aria-label={`Visual placeholder tentang ${profile.name}`}
          className="flex aspect-4/5 w-full items-center justify-center border border-navy/20 bg-navy-soft text-center text-xs font-semibold uppercase tracking-widest text-paper"
        >
          Foto / Visual Workspace
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-blue">
            Tentang Aku
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy md:text-5xl">
            {profile.aboutTitle}
          </h2>

          <div className="about-body mt-6 space-y-4 text-base leading-7 text-gray-blue">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
