export function Contact() {
  return (
    <section id="contact" className="border-t border-gray-blue/20 bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="border border-navy/15 bg-white p-8 md:p-14">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-blue">
              Get in Touch me
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy md:text-5xl">
              Mau ngobrol, atau info main? pc aja!
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-blue">
              Saya selalu terbuka untuk peluang magang, kolaborasi teknis, maupun diskusi seputar pengembangan web dan deployment server. Silakan hubungi saya melalui jalur di bawah ini.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="mailto:adrian@portfolio-adrian.web.id"
              className="bg-yellow px-6 py-3.5 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-paper"
            >
              Kirim Email
            </a>

            <a
              href="https://github.com/AdrianBintang29"
              target="_blank"
              rel="noreferrer"
              className="border border-navy px-6 py-3.5 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-paper"
            >
              Lihat GitHub ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}