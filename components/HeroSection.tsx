import Image from "next/image";

export default function HeroSection() {
  return (
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
  );
}