export default function ExperienceSection() {
  return (
    <section id="experience" className="max-w-2xl mx-6 sm:mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
        <span className="w-8 h-[2px] bg-amber-600"></span> Pengalaman
      </h2>
      <div className="mt-4 space-y-4">
        <div className="border-l-2 border-amber-600 pl-4">
          <h3 className="font-semibold text-gray-800">Magang Mandiri - Fullstack Developer</h3>
          <p className="text-sm text-gray-500">PT. Nyanhosting Solusi Website • Juli - Desember 2026</p>
          <p className="mt-1 text-sm text-gray-600">Mengembangkan aplikasi web menggunakan Next.js, Go, dan PostgreSQL.</p>
        </div>
      </div>
    </section>
  );
}