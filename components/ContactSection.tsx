export default function ContactSection() {
  return (
    <section id="contact" className="max-w-2xl mx-6 sm:mx-auto mt-10 mb-16 p-6 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-3">
        <span className="w-8 h-[2px] bg-amber-600"></span> Hubungi Saya
      </h2>
      <p className="mt-2 text-gray-600">
        Terbuka untuk kolaborasi atau sekadar ngobrol soal teknologi.
      </p>
      <div className="mt-4 flex justify-center gap-4">
        <a href="mailto:adrianbintang29@gmail.com" className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
          Email Saya
        </a>
        <a href="https://github.com/AdrianBintang29" target="_blank" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
          GitHub
        </a>
      </div>
    </section>
  );
}