export default function SkillsSection() {
  return (
    <section id="skills" className="max-w-2xl mx-6 sm:mx-auto mt-10 p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md transition-colors">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
        <span className="w-8 h-[2px] bg-amber-600"></span> Keahlian
      </h2>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg text-center">
          <p className="font-medium text-sm text-gray-800 dark:text-white">Next.js</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg text-center">
          <p className="font-medium text-sm text-gray-800 dark:text-white">Tailwind CSS</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg text-center">
          <p className="font-medium text-sm text-gray-800 dark:text-white">Go (Golang)</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg text-center">
          <p className="font-medium text-sm text-gray-800 dark:text-white">PostgreSQL</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg text-center">
          <p className="font-medium text-sm text-gray-800 dark:text-white">PHP & MySQL</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg text-center">
          <p className="font-medium text-sm text-gray-800 dark:text-white">C++</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg text-center">
          <p className="font-medium text-sm text-gray-800 dark:text-white">Figma</p>
        </div>
      </div>
    </section>
  );
}