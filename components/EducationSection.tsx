type Education = {
  id: number;
  institution: string;
  degree: string;
  period: string;
  description: string;
};

async function getEducation(): Promise<Education[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/education`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data;
}

export default async function EducationSection() {
  const educations = await getEducation();

  return (
    <section id="education" className="max-w-2xl mx-6 sm:mx-auto mt-10 p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md transition-colors">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
        <span className="w-8 h-[2px] bg-amber-600 dark:bg-cyan-400 dark:shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span> Pendidikan
      </h2>
      {educations.map((edu) => (
        <div key={edu.id} className="mt-4 border-l-2 border-amber-600 pl-4">
          <h3 className="font-semibold text-gray-800 dark:text-white">{edu.degree}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{edu.institution} • {edu.period}</p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{edu.description}</p>
        </div>
      ))}
    </section>
  );
}