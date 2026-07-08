export default function EducationSection() {
  return (
    <section id="education" className="max-w-2xl mx-6 sm:mx-auto mt-10 p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md transition-colors">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
        <span className="w-8 h-[2px] bg-amber-600"></span> Pendidikan
      </h2>
      <div className="mt-4 border-l-2 border-amber-600 pl-4">
        <h3 className="font-semibold text-gray-800 dark:text-white">S1 Teknik Informatika</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">UPN "Veteran" Jawa Timur • Semester 4</p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">NPM: 24081010274</p>
      </div>
    </section>
  );
}