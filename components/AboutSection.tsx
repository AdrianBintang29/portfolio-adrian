export default function AboutSection() {
  return (
    <section id="about" className="max-w-2xl mx-6 sm:mx-auto mt-16 p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md transition-colors">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
        <span className="w-8 h-[2px] bg-amber-600 dark:bg-cyan-400 dark:shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span> Tentang Saya
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        Mahasiswa Semester 4 Teknik Informatika di UPN Veteran Jawa Timur, saat ini sedang magang mandiri di PT. Nyanhosting.
      </p>
    </section>
  );
}