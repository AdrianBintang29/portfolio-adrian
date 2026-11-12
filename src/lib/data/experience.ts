export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  type: string;
  period: string;
  location: string;
  summary: string;
  points: string[];
  stack: string[];
  featured?: boolean;
}

export const experiences: ExperienceItem[] = [
  {
    id: 'nyanhosting-intern',
    company: 'Nyanhosting',
    role: 'Web Developer & Infrastructure Intern',
    type: 'Internship',
    period: '2026 - Sekarang',
    location: 'Surabaya, Indonesia',
    summary:
      'Terlibat aktif dalam pengembangan aplikasi web dan pemeliharaan infrastruktur hosting, memastikan sistem transisi aman dari lingkungan lokal ke lingkungan produksi.',
    points: [
      'Membantu pemeliharaan container Docker dan deployment aplikasi web pada server Linux Ubuntu.',
      'Mengeksplorasi pembuatan endpoint REST API performa tinggi menggunakan Go (Fiber) dan Next.js App Router.',
      'Mempelajari konfigurasi reverse proxy Nginx, pengelolaan sertifikat SSL, dan integrasi Cloudflare Tunnel.',
      'Mengelola skema database relasional dan persistensi volume data secara mandiri.',
    ],
    stack: ['Next.js', 'Go (Fiber)', 'Docker', 'Relational DB', 'Ubuntu Linux', 'Nginx'],
    featured: true,
  },
];
