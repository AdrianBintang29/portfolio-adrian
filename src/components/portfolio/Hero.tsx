import Image from 'next/image';
import { getProfile } from '@/lib/db/queries';

export async function Hero() {
  const profile = await getProfile();

  return (
    <section
      id="hero"
      className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-28"
    >
      <div>
        <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-gray-blue">
          {profile.role}
        </p>

        <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-navy md:text-7xl">
          Saya membangun website yang sederhana dan berguna.
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-8 text-gray-blue">
          {profile.bio}
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="bg-yellow px-5 py-3 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-paper"
          >
            Lihat project
          </a>

          <a
            href="#contact"
            className="border border-navy px-5 py-3 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-paper"
          >
            Hubungi saya
          </a>
        </div>
      </div>

      {profile.avatarUrl ? (
        <div className="relative aspect-square min-h-72 border border-navy md:min-h-96">
          <Image
            src={profile.avatarUrl}
            alt={`Foto ${profile.name}`}
            fill
            unoptimized
            priority
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div
          aria-label="Placeholder foto profile"
          role="img"
          className="flex aspect-square min-h-72 items-center justify-center border border-navy bg-navy-soft text-center text-sm font-bold uppercase tracking-[0.2em] text-paper md:min-h-96"
        >
          Placeholder foto
        </div>
      )}
    </section>
  );
}