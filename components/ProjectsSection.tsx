export default function ProjectsSection() {
  return (
    <section id="projects" className="max-w-2xl mx-6 sm:mx-auto mt-10 p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md transition-colors">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
        <span className="w-8 h-[2px] bg-amber-600 dark:bg-cyan-400 dark:shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span> Proyek
      </h2>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-neutral-700 dark:border dark:border-transparent dark:hover:border-cyan-500 rounded-lg hover:scale-105 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300">
          <h3 className="font-semibold text-gray-800 dark:text-white">AutoSpare</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Marketplace spare part kendaraan</p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-neutral-700 dark:border dark:border-transparent dark:hover:border-cyan-500 rounded-lg hover:scale-105 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300">
          <h3 className="font-semibold text-gray-800 dark:text-white">HerbalPakLuluk</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Sistem penjualan herbal berbasis PHP/MySQL</p>
        </div>
      </div>
    </section>
  );
}