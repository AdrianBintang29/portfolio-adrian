export type Language = 'id' | 'en';

export interface ContentData {
  badge: string;
  role: string;
  name: string;
  fullName: string;
  origin: string;
  statusTag: string;
  heroHeadline: string;
  heroBio: string;
  copyEmail: string;
  copied: string;
  downloadCv: string;
  viewProjects: string;
  
  // Profile quick specs
  profileCard: {
    title: string;
    items: {
      label: string;
      val: string;
    }[];
  };

  // Stats / Quick summary
  stats: {
    label: string;
    val: string;
  }[];

  // What I Can Do / Services & Capabilities
  servicesTitle: string;
  servicesSub: string;
  servicesList: {
    title: string;
    desc: string;
    points: string[];
  }[];

  // Featured Project: considrAI
  featuredBadge: string;
  projectTitle: string;
  projectSubtitle: string;
  projectSummary: string;
  projectRole: string;
  projectRoleDesc: string;
  projectDemoUrl?: string;
  projectGithubUrl?: string;
  keyCapabilitiesTitle: string;
  projectHighlights: {
    title: string;
    desc: string;
  }[];
  projectStack: string[];

  // Secondary projects
  secondaryProjectsTitle: string;
  secondaryProjects: {
    badge: string;
    title: string;
    desc: string;
    points: string[];
    stack: string[];
    demoUrl?: string;
    githubUrl?: string;
  }[];

  // Tech Stack
  skillsTitle: string;
  skillsSub: string;
  skillGroups: {
    title: string;
    items: string[];
  }[];

  // Contact
  ctaTitle: string;
  ctaSub: string;
  ctaAction: string;
}

export const content: Record<Language, ContentData> = {
  id: {
    badge: "Tersedia untuk Freelance & Kontrak",
    role: "Full-Stack Developer",
    name: "Adrian Bintang",
    fullName: "Muhammad Adrian Bintang Hariyanto",
    origin: "Indonesia",
    statusTag: "Mahasiswa Informatika + Praktisi Magang",
    heroHeadline: "Membangun web modern, dashboard berbasis data, dan integrasi API yang tangguh di kondisi nyata.",
    heroBio: "Saya mahasiswa Teknik Informatika di Indonesia yang aktif magang sebagai software engineer. Terbiasa membangun aplikasi web dari hulu ke hilir—mulai dari perancangan database PostgreSQL, REST API Go Fiber, hingga antarmuka Next.js yang responsif dan tahan edge-case.",
    copyEmail: "Salin Email",
    copied: "Tersalin!",
    downloadCv: "Unduh CV",
    viewProjects: "Lihat Proyek Unggulan",

    profileCard: {
      title: "Kartu Identitas Rekayasa",
      items: [
        { label: "Nama Lengkap", val: "Muhammad Adrian Bintang Hariyanto" },
        { label: "Peran", val: "Full-Stack Developer" },
        { label: "Asal", val: "Indonesia" },
        { label: "Aktivitas", val: "Kuliah Informatika + Magang Software Engineer" },
        { label: "Fokus Utama", val: "Web Application, Dashboard, & API Integration" },
      ]
    },

    stats: [
      { label: "Spesialisasi", val: "Full-Stack & API" },
      { label: "Backend Utama", val: "Go & PostgreSQL" },
      { label: "Frontend Utama", val: "Next.js & TypeScript" },
      { label: "Standar Kode", val: "Tahan Edge-Case" },
    ],

    servicesTitle: "Apa yang Bisa Saya Kerjakan",
    servicesSub: "Solusi web dari skema database sampai tampilan antarmuka—santai diajak diskusi, rapi saat eksekusi.",
    servicesList: [
      {
        title: "Aplikasi Web & Dashboard Interaktif",
        desc: "Membangun tampilan modern yang responsif, visualisasi chart, tabel data dengan multi-filter, pagination, dan state loading/error yang rapi.",
        points: ["Next.js & React (SSR & CSR)", "Desain responsif desktop & mobile", "Penanganan state error, empty, & loading"]
      },
      {
        title: "REST API Cepat & Arsitektur Backend",
        desc: "Merancang backend berkinerja tinggi dengan Go Fiber dan skema relasional PostgreSQL yang terstruktur serta aman.",
        points: ["Endpoint REST API kencang & hemat memori", "Skema database PostgreSQL & query optimal", "Autentikasi JWT & Role-Based Access"]
      },
      {
        title: "Integrasi API & Ketahanan Data",
        desc: "Menghubungkan aplikasi ke API pihak ketiga tanpa drama timeout atau crash saat penyedia eksternal bermasalah.",
        points: ["Normalisasi response pihak ketiga sebelum masuk frontend", "Mekanisme caching cerdas untuk hemat kuota", "Penanganan missing value tanpa bikin rusak UI"]
      },
      {
        title: "Beresin Bug & Optimasi Sistem",
        desc: "Membantu merapikan alur data yang berantakan, menyelesaikan race conditions, dan mempercepat loading aplikasi.",
        points: ["Audit alur data frontend-backend", "Optimasi query SQL & payload response", "Refactor komponen agar modular dan mudah dirawat"]
      }
    ],

    featuredBadge: "Proyek Unggulan",
    projectTitle: "considrAI",
    projectSubtitle: "Platform Riset Pasar Saham & Engine Finansial Terpadu",
    projectSummary: "Platform riset pasar modal (US Stocks, IDX, ETF) yang menyatukan data pasar live, analisis fundamental, kalkulasi fair value DCF, kalender NYSE, dan personal watchlist.",
    projectRole: "Peran Utama",
    projectRoleDesc: "Frontend Developer & API Integration Developer — arsitektur komponen Next.js, visualisasi data, kontrak API terstandarisasi, dan alur demo deployment.",
    projectDemoUrl: "https://considrai.com",
    projectGithubUrl: "https://github.com/AdrianBintang29",
    keyCapabilitiesTitle: "Kapabilitas Krusial yang Diterapkan:",
    projectHighlights: [
      {
        title: "Kontrak API Seragam Frontend-Backend",
        desc: "Menyusun skema data standar sehingga perubahan struktur mentah third-party provider tidak merusak antarmuka."
      },
      {
        title: "DCF Engine & Visualisasi Finansial",
        desc: "Mengintegrasikan perhitungan valuasi discounted cash flow dan visualisasi grafik harga historis interaktif."
      },
      {
        title: "Integrasi Multi-Sumber API",
        desc: "Menghubungkan yfinance, feed berita real-time berdasar ticker, dan kalender perdagangan pasar NYSE."
      },
      {
        title: "Resilient Error & State Recovery",
        desc: "Aplikasi tetap stabil saat API eksternal lambat atau timeout, menyajikan visualisasi state yang transparan bagi pengguna."
      }
    ],
    projectStack: ["Next.js", "React", "TypeScript", "Go Fiber", "PostgreSQL", "Python", "yfinance", "Vercel"],

    secondaryProjectsTitle: "Proyek Lainnya",
    secondaryProjects: [
      {
        badge: "Backend & Database",
        title: "High-Performance Go REST API",
        desc: "Layanan microservice REST API dengan Go Fiber, autentikasi JWT, role-based access control, dan arsitektur database PostgreSQL.",
        points: ["Middleware auth & security", "Optimasi query SQL", "Struktur clean architecture"],
        stack: ["Go", "Go Fiber", "PostgreSQL", "JWT", "Docker"],
        githubUrl: "https://github.com/AdrianBintang29"
      },
      {
        badge: "Frontend & Dashboard",
        title: "Data Analytics & Admin Operations",
        desc: "Dashboard operasional modern dengan tabel data interaktif, multi-filter, pagination server-side, dan visualisasi metrik bisnis.",
        points: ["Responsive mobile & desktop", "State loading/empty/error", "Dark & light theme"],
        stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        githubUrl: "https://github.com/AdrianBintang29"
      }
    ],

    skillsTitle: "Tech Stack",
    skillsSub: "Teknologi yang digunakan secara aktif dalam produksi.",
    skillGroups: [
      {
        title: "Frontend",
        items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "JavaScript", "HTML/CSS"]
      },
      {
        title: "Backend",
        items: ["Go (Golang)", "Go Fiber", "Python", "RESTful API", "Data Normalization"]
      },
      {
        title: "Database & Auth",
        items: ["PostgreSQL", "SQL", "JWT", "Google OAuth", "Role-Based Access"]
      },
      {
        title: "Tools & Deployment",
        items: ["Git / GitHub", "Vercel", "Postman", "Docker", "ngrok"]
      }
    ],

    ctaTitle: "Butuh Sistem Web yang Stabil & Siap Skala?",
    ctaSub: "Tersedia untuk freelance, kontrak proyek, atau kolaborasi teknis.",
    ctaAction: "Kirim Pesan"
  },

  en: {
    badge: "Available for Freelance & Contracts",
    role: "Full-Stack Developer",
    name: "Adrian Bintang",
    fullName: "Muhammad Adrian Bintang Hariyanto",
    origin: "Indonesia",
    statusTag: "Informatics Student + Software Engineering Intern",
    heroHeadline: "Building modern web applications, data-driven dashboards, and robust API integrations built for real-world reliability.",
    heroBio: "I am an Informatics student in Indonesia actively working as a software engineering intern. Experienced in delivering web systems from end-to-end—spanning PostgreSQL database schemas, Go Fiber REST APIs, to responsive Next.js client interfaces built for production stability.",
    copyEmail: "Copy Email",
    copied: "Copied!",
    downloadCv: "Download CV",
    viewProjects: "View Featured Project",

    profileCard: {
      title: "Engineer Identity Card",
      items: [
        { label: "Full Name", val: "Muhammad Adrian Bintang Hariyanto" },
        { label: "Role", val: "Full-Stack Developer" },
        { label: "Origin", val: "Indonesia" },
        { label: "Current Status", val: "CS Student + Software Engineering Intern" },
        { label: "Core Focus", val: "Web Application, Dashboard, & API Integration" },
      ]
    },

    stats: [
      { label: "Specialization", val: "Full-Stack & API" },
      { label: "Core Backend", val: "Go & PostgreSQL" },
      { label: "Core Frontend", val: "Next.js & TypeScript" },
      { label: "Code Standard", val: "Edge-Case Resilient" },
    ],

    servicesTitle: "What I Can Do",
    servicesSub: "End-to-end web engineering from database schema to responsive UI—easy to collaborate with, rigorous in code.",
    servicesList: [
      {
        title: "Web Applications & Data Dashboards",
        desc: "Building clean responsive client interfaces, interactive chart metrics, rich data tables with multi-filter parameters, pagination, and thorough state handling.",
        points: ["Next.js & React (SSR & CSR)", "Mobile & desktop responsive layouts", "Complete loading, empty, and error state coverage"]
      },
      {
        title: "Fast REST APIs & Backend Architecture",
        desc: "Designing high-throughput microservices using Go Fiber paired with normalized, optimized PostgreSQL database relational schemas.",
        points: ["Low-latency, lightweight Go REST endpoints", "Relational PostgreSQL design & query indexing", "Secure token-based JWT authentication & RBAC"]
      },
      {
        title: "API Integration & Data Resilience",
        desc: "Connecting third-party providers reliably without unhandled crashes or timeouts when external systems fail.",
        points: ["Strict external response normalization before client ingestion", "Smart caching strategies to minimize provider cost & latency", "Graceful missing value handling without fabricating fake data"]
      },
      {
        title: "Bug Resolution & System Optimization",
        desc: "Untangling problematic data flows, resolving race conditions, optimizing payload queries, and speeding up application response times.",
        points: ["End-to-end frontend-backend data flow audits", "SQL query & network payload size optimizations", "Modular component refactoring for long-term maintainability"]
      }
    ],

    featuredBadge: "Featured Showcase",
    projectTitle: "considrAI",
    projectSubtitle: "Market Intelligence & AI Fundamental Platform",
    projectSummary: "Integrated stock market research platform (US Stocks, IDX, ETFs) combining live market feeds, DCF fair value engine, NYSE trading calendars, and personal watchlists.",
    projectRole: "My Role",
    projectRoleDesc: "Frontend Developer & API Integration Developer — architected Next.js client components, data visualizers, standardized API contracts, and demo deployment pipelines.",
    projectDemoUrl: "https://considrai.com",
    projectGithubUrl: "https://github.com/AdrianBintang29",
    keyCapabilitiesTitle: "Crucial Capabilities Demonstrated:",
    projectHighlights: [
      {
        title: "Standardized API Contract",
        desc: "Designed unified schemas decoupling frontend UI from unpredictable third-party upstream breaking changes."
      },
      {
        title: "DCF Engine & Financial Charts",
        desc: "Integrated discounted cash flow valuation modeling and multi-range interactive historical price charts."
      },
      {
        title: "Multi-Source API Orchestration",
        desc: "Seamlessly merged yfinance market feeds, ticker-based real-time news, and NYSE session & holiday calendars."
      },
      {
        title: "Resilient Error & State Recovery",
        desc: "System gracefully absorbs third-party latency and failures, preserving transparent state messages for the user."
      }
    ],
    projectStack: ["Next.js", "React", "TypeScript", "Go Fiber", "PostgreSQL", "Python", "yfinance", "Vercel"],

    secondaryProjectsTitle: "Other Projects",
    secondaryProjects: [
      {
        badge: "Backend & Database",
        title: "High-Performance Go REST API",
        desc: "REST API microservice architecture with Go Fiber, JWT authentication, role-based access control, and PostgreSQL relational schemas.",
        points: ["Auth & security middleware", "SQL query optimization", "Clean architecture layout"],
        stack: ["Go", "Go Fiber", "PostgreSQL", "JWT", "Docker"],
        githubUrl: "https://github.com/AdrianBintang29"
      },
      {
        badge: "Frontend & Dashboard",
        title: "Data Analytics & Admin Operations",
        desc: "Modern operational dashboard featuring interactive data tables, multi-filter query params, server-side pagination, and metric visualizers.",
        points: ["Responsive mobile & desktop", "Loading/empty/error states", "Dark & light themes"],
        stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        githubUrl: "https://github.com/AdrianBintang29"
      }
    ],

    skillsTitle: "Tech Stack",
    skillsSub: "Core technologies used actively in production environments.",
    skillGroups: [
      {
        title: "Frontend",
        items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "JavaScript", "HTML/CSS"]
      },
      {
        title: "Backend",
        items: ["Go (Golang)", "Go Fiber", "Python", "RESTful API", "Data Normalization"]
      },
      {
        title: "Database & Auth",
        items: ["PostgreSQL", "SQL", "JWT", "Google OAuth", "Role-Based Access"]
      },
      {
        title: "Tools & Deployment",
        items: ["Git / GitHub", "Vercel", "Postman", "Docker", "ngrok"]
      }
    ],

    ctaTitle: "Need a Stable, Production-Ready Web System?",
    ctaSub: "Available for freelance projects, contract roles, or technical engineering collaboration.",
    ctaAction: "Get in Touch"
  }
};
