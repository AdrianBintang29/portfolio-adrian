export interface ProjectItem {
  id: string;
  title: string;
  summary: string;
  stack: string[];
  demoUrl?: string;
  repoUrl?: string;
  featured: boolean;
}

export interface SkillGroup {
  category: string;
  description: string;
  items: string[];
}

export const initialProjects: ProjectItem[] = [
  {
    id: 'portfolio-vps',
    title: 'Personal Portfolio & VPS Stack',
    summary:
      'Aplikasi portfolio web dengan Next.js App Router, Docker multi-stage build, Nginx Proxy Manager, dan Cloudflare Tunnel pada VPS Ubuntu.',
    stack: ['Next.js', 'TypeScript', 'Docker', 'Nginx', 'Ubuntu'],
    demoUrl: 'https://portfolio-adrian.web.id',
    repoUrl: 'https://github.com/AdrianBintang29/portfolio-adrian',
    featured: true,
  },
  {
    id: 'task-activity-manager',
    title: 'Task & Activity Manager',
    summary:
      'Sistem pencatatan tugas dengan fokus pada alur manipulasi state, validasi data pengguna, dan efisiensi layout responsive.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
    repoUrl: 'https://github.com/AdrianBintang29',
    featured: false,
  },
  {
    id: 'api-service-monitor',
    title: 'API Integration & Service Monitor',
    summary:
      'Eksplorasi perancangan endpoint REST API, konsumsi service pihak ketiga, dan pemantauan kesehatan container aplikasi.',
    stack: ['Node.js', 'REST API', 'Docker', 'Linux'],
    repoUrl: 'https://github.com/AdrianBintang29',
    featured: false,
  },
];

export const initialSkillGroups: SkillGroup[] = [
  {
    category: 'Frontend Development',
    description: 'Membangun antarmuka web modern yang responsif, terstruktur, dan mudah dirawat.',
    items: ['React', 'Next.js (App Router)', 'TypeScript', 'Tailwind CSS', 'HTML5 / CSS3'],
  },
  {
    category: 'Backend & Data',
    description: 'Menyusun alur data aplikasi, endpoint RESTful, dan manajemen database relasional.',
    items: ['Next.js Route Handlers', 'Node.js', 'PostgreSQL', 'Prisma ORM', 'REST API Architecture'],
  },
  {
    category: 'DevOps & Deployment',
    description: 'Mengisolasi environment kerja dan mengelola hosting mandiri di server Linux.',
    items: [
      'Docker & Multi-stage Build',
      'Docker Compose',
      'Ubuntu Server (Linux CLI)',
      'Nginx Proxy Manager',
      'Cloudflare Tunnel',
    ],
  },
];