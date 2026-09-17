export type Language = 'id' | 'en';

export interface PortfolioData {
  badge: string;
  name: string;
  fullName: string;
  greeting: string;
  location: string;
  statusTag: string;
  title: string;
  heroPitch: string;
  heroSub: string;
  ctaGetStarted: string;
  copyEmail: string;
  copied: string;
  downloadCV: string;
  viewWork: string;

  quickHighlights: {
    icon: string;
    title: string;
    subtitle: string;
    desc: string;
  }[];

  // About / Bio section
  aboutTitle: string;
  aboutRole: string;
  aboutBio: string;
  aboutCommitmentTitle: string;
  aboutCommitment: string;
  profileDetails: {
    label: string;
    value: string;
  }[];

  stats: {
    label: string;
    val: string;
  }[];

  capabilitiesTitle: string;
  capabilitiesSub: string;
  capabilities: {
    title: string;
    desc: string;
    points: string[];
  }[];

  featuredTitle: string;
  featuredBadge: string;
  projectRole: string;
  projectRoleDesc: string;
  projectOverview: string;
  crucialCapabilitiesTitle: string;
  projectHighlights: {
    title: string;
    desc: string;
  }[];
  projectStack: string[];

  otherProjectsTitle: string;
  otherProjects: {
    title: string;
    category: string;
    desc: string;
    points: string[];
    stack: string[];
  }[];

  skillsTitle: string;
  skillsSub: string;
  skillCategories: {
    name: string;
    skills: string[];
  }[];

  servicesTitle: string;
  servicesSub: string;
  services: {
    title: string;
    desc: string;
  }[];

  contactTitle: string;
  contactSub: string;
  email: string;
  github: string;
  linkedin: string;
}

export const portfolioContent: Record<Language, PortfolioData> = {
  id: {
    badge: "Tersedia untuk Freelance & Kontrak",
    name: "Adrian Bintang",
    fullName: "Muhammad Adrian Bintang Hariyanto",
    greeting: "Halo, saya",
    location: "Surabaya, Indonesia",
    statusTag: "Mahasiswa Informatika + Praktisi Magang",
    title: "Full-Stack Web Developer",
    heroPitch: "Membangun web modern, dashboard berbasis data, dan integrasi API yang tangguh di kondisi nyata.",
    heroSub: "Full-stack developer berbasis di Surabaya. Butuh web kustom atau dashboard data yang stabil dan andal? Mari berdiskusi.",
    ctaGetStarted: "Mulai Proyek",
    copyEmail: "Salin Email",
    copied: "Tersalin!",
    downloadCV: "Unduh CV",
    viewWork: "Lihat Proyek",

    // Split Hero Quick Highlights (Inspired by creative personal landing)
    quickHighlights: [
      {
        icon: "layout",
        title: "FRONTEND MODERN",
        subtitle: "Next.js, React, TypeScript",
        desc: "Antarmuka responsif, transisi halus, state loading/error teruji, dan rendering cepat."
      },
      {
        icon: "server",
        title: "BACKEND BERSIH",
        subtitle: "Go (Fiber), PostgreSQL, Python",
        desc: "REST API performa tinggi, perancangan skema relasional, dan otorisasi aman."
      },
      {
        icon: "api",
        title: "INTEGRASI API",
        subtitle: "Third-Party & Data Contracts",
        desc: "Normalisasi data, cache pintar, tahan timeout jaringan dan provider eksternal rusak."
      }
    ],

    aboutTitle: "Profil & Komitmen Kerja",
    aboutRole: "Pengembang Full-Stack Berorientasi Ketahanan Sistem",
    aboutBio: "Saya mahasiswa Teknik Informatika di Surabaya yang aktif magang sebagai software engineer. Terbiasa membangun aplikasi web dari hulu ke hilir—mulai dari perancangan skema database dan integrasi REST API hingga tampilan antarmuka interaktif responsif.",
    aboutCommitmentTitle: "Komitmen Kerja untuk Klien:",
    aboutCommitment: "Saya menghargai kepercayaan Anda. Setiap proyek freelance dikerjakan dengan estimasi waktu realistis, komunikasi progres transparan tanpa ghosting, dan standar kode teruji yang tahan terhadap kegagalan jaringan atau data eksternal.",
    profileDetails: [
      { label: "Domisili", value: "Surabaya, Indonesia (UTC+7)" },
      { label: "Aktivitas", value: "Kuliah Informatika + Magang Software Engineering" },
      { label: "Fokus Layanan", value: "Freelance Web Application, Dashboard, & API Integration" },
      { label: "Metode Kerja", value: "Remote, Komunikasi Transparan, Update Rutin" }
    ],

    stats: [
      { label: "Spesialisasi", val: "Full-Stack & API" },
      { label: "Backend Utama", val: "Go & PostgreSQL" },
      { label: "Frontend Utama", val: "Next.js & TypeScript" },
      { label: "Standar Kode", val: "Tahan Edge-Case" },
    ],

    capabilitiesTitle: "Kapabilitas Rekayasa Inti",
    capabilitiesSub: "Bukan sekadar tampilan visual, tapi arsitektur alur data dari database sampai antarmuka pengguna.",
    capabilities: [
      {
        title: "Arsitektur Full-Stack End-to-End",
        desc: "Mengembangkan aplikasi dari kebutuhan bisnis, skema database, REST API performa tinggi, hingga antarmuka responsif.",
        points: [
          "REST API cepat & efisien dengan Go Fiber",
          "Desain relasional & optimasi PostgreSQL",
          "Komponen modular Next.js / React (SSR & CSR)"
        ]
      },
      {
        title: "Ketahanan Data & Integrasi Eksternal",
        desc: "Mencegah aplikasi crash saat menghadapi koneksi lambat, timeout, atau response provider luar yang tidak valid.",
        points: [
          "Normalisasi payload pihak ketiga sebelum konsumsi frontend",
          "Penanganan missing values tanpa menyisipkan data palsu",
          "Mekanisme caching & sinkronisasi data pintar"
        ]
      },
      {
        title: "Sistem State & Keamanan Teruji",
        desc: "Setiap antarmuka dirancang matang dengan penanganan status lengkap untuk menjamin kenyamanan pengguna.",
        points: [
          "Loading, empty, error, partial, dan stale states",
          "JWT auth, role-based access, & Google OAuth",
          "Antarmuka bilingual (ID/EN) & dark mode mulus"
        ]
      }
    ],

    featuredTitle: "considrAI",
    featuredBadge: "Proyek Unggulan",
    projectRole: "Peran Utama",
    projectRoleDesc: "Frontend Developer & API Integration Developer — arsitektur komponen Next.js, visualisasi data, kontrak API terstandarisasi, dan alur demo deployment.",
    projectOverview: "Platform riset pasar saham (US Stocks, IDX, ETF) yang menyatukan data pasar live, analisis fundamental, kalkulasi fair value DCF, kalender NYSE, dan personal watchlist dalam satu dashboard terpadu.",
    crucialCapabilitiesTitle: "Kapabilitas Krusial yang Diterapkan:",
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

    otherProjectsTitle: "Proyek Lainnya",
    otherProjects: [
      {
        title: "High-Performance Go REST API",
        category: "Backend & Database",
        desc: "Layanan microservice REST API dengan Go Fiber, autentikasi JWT, role-based access control, dan arsitektur database PostgreSQL.",
        points: ["Middleware auth & security", "Optimasi query SQL", "Struktur clean architecture"],
        stack: ["Go", "Go Fiber", "PostgreSQL", "JWT", "Docker"]
      },
      {
        title: "Data Analytics & Admin Operations",
        category: "Frontend & Dashboard",
        desc: "Dashboard operasional modern dengan tabel data interaktif, multi-filter, pagination server-side, dan visualisasi metrik bisnis.",
        points: ["Responsive mobile & desktop", "State loading/empty/error", "Dark & light theme"],
        stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"]
      }
    ],

    skillsTitle: "Tech Stack",
    skillsSub: "Teknologi yang aktif digunakan dalam lingkungan produksi.",
    skillCategories: [
      {
        name: "Frontend",
        skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "JavaScript", "HTML/CSS"]
      },
      {
        name: "Backend",
        skills: ["Go (Golang)", "Go Fiber", "Python", "RESTful API", "Data Normalization"]
      },
      {
        name: "Database & Auth",
        skills: ["PostgreSQL", "SQL", "JWT", "Google OAuth", "Role-Based Access"]
      },
      {
        name: "Tools & Deploy",
        skills: ["Git", "GitHub", "Vercel", "Postman", "Docker", "ngrok"]
      }
    ],

    servicesTitle: "Layanan yang Saya Tawarkan",
    servicesSub: "Solusi teknis siap produksi untuk bisnis dan startup.",
    services: [
      {
        title: "Aplikasi Web & Dashboard Bisnis",
        desc: "Membangun sistem analytics, tabel dinamis, filter multi-parameter, pagination, dan visualisasi chart interaktif."
      },
      {
        title: "Integrasi REST API & Third-Party",
        desc: "Menghubungkan aplikasi ke penyedia payment, authentication, data eksternal, dan normalisasi response aman."
      },
      {
        title: "Pengembangan Backend & Database",
        desc: "Pembuatan REST API cepat dengan Go, perancangan skema relasional PostgreSQL, dan otorisasi aman."
      },
      {
        title: "Perbaikan Bug & Optimasi Reliabilitas",
        desc: "Menyelesaikan race-conditions, penanganan error state, optimasi loading, serta audit integrasi API."
      }
    ],

    contactTitle: "Butuh Sistem Web yang Tangguh & Stabil?",
    contactSub: "Saya terbuka untuk proyek freelance, kontrak sistem, atau kolaborasi teknis.",
    email: "adrianbintang29@gmail.com",
    github: "https://github.com/AdrianBintang29",
    linkedin: "https://linkedin.com/in/adrianbintang"
  },

  en: {
    badge: "Available for Freelance & Contracts",
    name: "Adrian Bintang",
    fullName: "Muhammad Adrian Bintang Hariyanto",
    greeting: "Hi, I'm",
    location: "Surabaya, Indonesia",
    statusTag: "Computer Science Student + Active Intern",
    title: "Full-Stack Web Developer",
    heroPitch: "Building modern web applications, data-driven dashboards, and robust API integrations built for real-world reliability.",
    heroSub: "Full-stack developer based in Surabaya. Need a custom website or data dashboard that stays stable? Let's talk.",
    ctaGetStarted: "Let's Talk",
    copyEmail: "Copy Email",
    copied: "Copied!",
    downloadCV: "Download CV",
    viewWork: "View Projects",

    // Split Hero Quick Highlights (Inspired by creative personal landing)
    quickHighlights: [
      {
        icon: "layout",
        title: "MODERN FRONTEND",
        subtitle: "Next.js, React, TypeScript",
        desc: "Responsive interfaces, smooth transitions, complete state coverage, and fast rendering."
      },
      {
        icon: "server",
        title: "CLEAN BACKEND",
        subtitle: "Go (Fiber), PostgreSQL, Python",
        desc: "High-throughput REST APIs, relational schema design, and secure authorization."
      },
      {
        icon: "api",
        title: "API INTEGRATION",
        subtitle: "Third-Party & Data Contracts",
        desc: "Data normalization, smart caching, resilient against network timeouts and external provider errors."
      }
    ],

    aboutTitle: "Profile & Work Commitment",
    aboutRole: "Full-Stack Engineer Focused on System Resilience",
    aboutBio: "I am a Computer Science student in Surabaya and an active software engineering intern. Experienced in end-to-end web delivery—from relational database modeling and REST API engineering to responsive and interactive user interfaces.",
    aboutCommitmentTitle: "Client Commitment:",
    aboutCommitment: "I respect client trust and deadlines. Every freelance engagement includes realistic milestone timelines, clear and proactive communication without ghosting, and robust code tested to survive network degradation and external provider errors.",
    profileDetails: [
      { label: "Location", value: "Surabaya, Indonesia (UTC+7)" },
      { label: "Current Status", value: "CS Degree Student + Software Engineering Intern" },
      { label: "Service Focus", value: "Freelance Web Apps, Business Dashboards, & API Integration" },
      { label: "Work Style", value: "Remote, Transparent Communication, Regular Milestones" }
    ],

    stats: [
      { label: "Specialization", val: "Full-Stack & API" },
      { label: "Core Backend", val: "Go & PostgreSQL" },
      { label: "Core Frontend", val: "Next.js & TypeScript" },
      { label: "Code Standard", val: "Edge-Case Resilient" },
    ],

    capabilitiesTitle: "Core Engineering Capabilities",
    capabilitiesSub: "Beyond clean UI: dependable data flow from database schema to user interface.",
    capabilities: [
      {
        title: "End-to-End Full-Stack Architecture",
        desc: "Delivering features from business requirements, database schemas, high-throughput REST APIs, to responsive user interfaces.",
        points: [
          "High-performance REST API with Go Fiber",
          "Relational schema design & optimization in PostgreSQL",
          "Modular Next.js / React components (SSR & CSR)"
        ]
      },
      {
        title: "Data Resilience & Provider Integration",
        desc: "Ensuring applications never crash under slow networks, provider timeouts, or malformed third-party payloads.",
        points: [
          "Strict third-party payload normalization before frontend consumption",
          "Graceful missing value handling without fabricating fake data",
          "Smart client-side caching & synchronization mechanisms"
        ]
      },
      {
        title: "Production State & Security Control",
        desc: "Polished UX built with rigorous state coverage ensuring end users are never left in an unhandled crash loop.",
        points: [
          "Loading, empty, error, partial, and stale states",
          "JWT auth, role-based access control, & Google OAuth",
          "Bilingual (EN/ID) support and seamless dark mode"
        ]
      }
    ],

    featuredTitle: "considrAI",
    featuredBadge: "Featured Showcase",
    projectRole: "My Role",
    projectRoleDesc: "Frontend Developer & API Integration Developer — architected Next.js client components, data visualizers, standardized API contracts, and demo deployment pipelines.",
    projectOverview: "Integrated stock market research platform (US Stocks, IDX, ETFs) combining live market feeds, fundamental analysis, DCF fair value engine, NYSE trading calendars, and personal watchlists.",
    crucialCapabilitiesTitle: "Crucial Capabilities Demonstrated:",
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

    otherProjectsTitle: "Other Projects",
    otherProjects: [
      {
        title: "High-Performance Go REST API",
        category: "Backend & Database",
        desc: "Microservice REST API built with Go Fiber, JWT authentication, role-based access control, and PostgreSQL database architecture.",
        points: ["Auth & security middleware", "Optimized SQL queries", "Clean architecture structure"],
        stack: ["Go", "Go Fiber", "PostgreSQL", "JWT", "Docker"]
      },
      {
        title: "Data Analytics & Admin Operations",
        category: "Frontend & Dashboard",
        desc: "Modern operational dashboard with interactive tables, multi-parameter filtering, server-side pagination, and metric visualizations.",
        points: ["Mobile & desktop responsive", "Loading/empty/error states", "Dark & light theme"],
        stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"]
      }
    ],

    skillsTitle: "Tech Stack",
    skillsSub: "Core technologies used actively in production environments.",
    skillCategories: [
      {
        name: "Frontend",
        skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "JavaScript", "HTML/CSS"]
      },
      {
        name: "Backend",
        skills: ["Go (Golang)", "Go Fiber", "Python", "RESTful API", "Data Normalization"]
      },
      {
        name: "Database & Auth",
        skills: ["PostgreSQL", "SQL", "JWT", "Google OAuth", "Role-Based Access"]
      },
      {
        name: "Tools & Deploy",
        skills: ["Git", "GitHub", "Vercel", "Postman", "Docker", "ngrok"]
      }
    ],

    servicesTitle: "Services Offered",
    servicesSub: "Production-ready engineering solutions for businesses and startups.",
    services: [
      {
        title: "Web Applications & Business Dashboards",
        desc: "Building analytics systems, interactive data tables, multi-parameter filters, pagination, and visual metrics."
      },
      {
        title: "REST API & Third-Party Integration",
        desc: "Connecting systems with payment processors, authentication flows, external APIs, and payload normalization."
      },
      {
        title: "Backend & Database Development",
        desc: "Constructing high-throughput Go REST services, PostgreSQL schemas, and secure token authorization."
      },
      {
        title: "Bug Resolution & Reliability Audits",
        desc: "Fixing edge-case race conditions, incomplete error boundaries, slow loads, and brittle API integrations."
      }
    ],

    contactTitle: "Need a Resilient, Production-Ready Web System?",
    contactSub: "Available for freelance projects, contract roles, or technical engineering collaboration.",
    email: "adrianbintang29@gmail.com",
    github: "https://github.com/AdrianBintang29",
    linkedin: "https://linkedin.com/in/adrianbintang"
  }
};
