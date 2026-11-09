import { getSkillGroups } from '@/lib/db/queries';

export async function Skills() {
  const skillGroups = await getSkillGroups();

  return (
    <section id="skills" className="border-t border-gray-blue/20 bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-blue">
            Technical Skills
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy md:text-5xl">
            Teknologi & Lingkungan Kerja
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-blue">
            Peralatan, bahasa, dan runtime yang saya gunakan secara aktif untuk merancang, menguji, dan mendeploy aplikasi web.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {skillGroups.map((group) => (
            <div
              key={group.category}
              className="flex flex-col border border-navy/15 bg-white p-7 transition-colors hover:border-navy"
            >
              <h3 className="text-lg font-bold text-navy">
                {group.category}
              </h3>

              <div className="my-6 border-t border-navy/10" />

              <ul className="flex flex-col gap-2.5">
                {group.items.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center gap-2 text-sm font-medium text-navy"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}