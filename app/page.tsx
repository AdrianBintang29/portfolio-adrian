import Image from "next/image";
export default function Home() {
  return (
    <main className="min-h-screen bg-orange-50">
      <nav className="max-w-2xl mx-auto px-6 py-6 flex justify-between items-center">
  <span className="font-semibold text-stone-800">Adrian Bintang</span>
  <div className="flex gap-6 text-sm text-stone-600">
    <a href="#about" className="hover:text-amber-600 transition-colors">Tentang</a>
    <a href="#projects" className="hover:text-amber-600 transition-colors">Proyek</a>
  </div>
</nav>
      {/* Hero Section */}
      <section className="max-w-2xl mx-auto pt-20 text-center">
      <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-white shadow-md p-1">
  <Image
    src="/profile1.jpg"
    alt="Adrian Bintang"
    width={120}
    height={120}
    className="rounded-full w-full h-full object-cover"
  />
</div>
        <h1 className="text-5xl font-bold text-stone-800 font-[family-name:var(--font-playfair)]">Adrian Bintang</h1>
        <p className="mt-2 text-gray-600">Mahasiswa Informatika | Fullstack Developer</p>
        <div className="mt-6 flex justify-center gap-3">
  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Next.js</span>
  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Tailwind</span>
  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Go</span>
</div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-2xl mx-6 sm:mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <span className="w-8 h-[2px] bg-amber-600"></span> Tentang Saya
        </h2>
        <p className="mt-2 text-gray-600">
          Mahasiswa Semester 4 Teknik Informatika di UPN Veteran Jawa Timur, saat ini sedang magang mandiri di PT. Nyanhosting.
        </p>
      </section>

      {/* Projects Section */}
      <section id="projects" className="max-w-2xl mx-6 sm:mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <span className="w-8 h-[2px] bg-amber-600"></span> Proyek
        </h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-300">
            <h3 className="font-semibold text-gray-800">AutoSpare</h3>
            <p className="text-sm text-gray-500">Marketplace spare part kendaraan</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-300">
            <h3 className="font-semibold text-gray-800">HerbalPakLuluk</h3>
            <p className="text-sm text-gray-500">Sistem penjualan herbal berbasis PHP/MySQL</p>
          </div>
        </div>
      </section>
    </main>
  );
}