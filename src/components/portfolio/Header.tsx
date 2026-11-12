import { getProfile } from '@/lib/db/queries';
import { HeaderNav } from './HeaderNav';

export async function Header() {
  const profile = await getProfile();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        {/* Brand Logo kiri ala Gambar 3 */}
        <a
          href="#top"
          className="group flex items-center gap-1.5 text-xl font-extrabold tracking-tight text-ink"
        >
          <span>{profile.name.split(' ')[0]}</span>
          <span className="text-accent font-black">.</span>
        </a>

        {/* Navigasi kanan dengan urutan Projects -> About -> Skills -> Contact & ScrollSpy */}
        <nav aria-label="Navigasi utama" className="flex items-center gap-6 sm:gap-8">
          <HeaderNav />

          {/* Tombol CV ↗ */}
          <a
            href="/CV-Adrian-Bintang.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-line bg-surface px-4 py-2 text-xs font-bold text-ink shadow-xs transition-colors hover:border-accent hover:text-accent"
          >
            <span>CV</span>
            <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
