import { Mail, Code2 } from "lucide-react";
export default function ContactSection() {
  return (
    <section id="contact" className="max-w-2xl mx-6 sm:mx-auto mt-10 mb-16 p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md text-center transition-colors">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-3">
        <span className="w-8 h-[2px] bg-amber-600"></span> Hubungi Saya
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        Terbuka untuk kolaborasi atau sekadar ngobrol soal teknologi.
      </p>
      <div className="mt-4 flex justify-center gap-4">
        <a href="https://github.com/AdrianBintang29" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors">
  <Mail size={16} />
  Email Saya
</a>
<a href="https://github.com/AdrianBintang29" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
  <Code2 size={16} />
  GitHub
</a>
      </div>
    </section>
  );
}