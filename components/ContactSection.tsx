import { Mail, Code2 } from "lucide-react";
export default function ContactSection() {
  return (
    <section id="contact" className="max-w-2xl mx-6 sm:mx-auto mt-10 mb-16 p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md text-center transition-colors">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-3">
        <span className="w-8 h-[2px] bg-amber-600 dark:bg-cyan-400 dark:shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span> Hubungi Saya
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        Terbuka untuk kolaborasi atau sekadar ngobrol soal teknologi.
      </p>
      <div className="mt-4 flex justify-center gap-4">
        <a href="mailto:adrianbintang29@gmail.com" className="flex items-center gap-2 px-4 py-2 bg-amber-600 dark:bg-cyan-500 text-white rounded-lg text-sm font-medium hover:bg-amber-700 dark:hover:bg-cyan-400 dark:hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all">
  <Mail size={16} />
  Email Saya
</a>
<a href="https://github.com/AdrianBintang29" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-neutral-800 dark:border dark:border-cyan-800 text-gray-700 dark:text-cyan-400 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:border-cyan-400 dark:hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all">
  <Code2 size={16} />
  GitHub
</a>
      </div>
    </section>
  );
}