interface TechIconProps {
  name: string;
  className?: string;
}

export function TechIcon({ name, className = 'w-5 h-5' }: TechIconProps) {
  const normalized = name.toLowerCase();

  // 1. React
  if (normalized.includes('react')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#00D8FE" strokeWidth="1.5" aria-hidden="true">
        <ellipse cx="12" cy="12" rx="10" ry="4.5" />
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="2" fill="#00D8FE" />
      </svg>
    );
  }

  // 2. Next.js
  if (normalized.includes('next.js') || normalized.includes('nextjs')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#000000" stroke="#FFFFFF" strokeWidth="1.2" />
        <path d="M7.5 7.5V16.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16.5 7.5V12" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7.5 7.5L16.2 16.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 3. TypeScript
  if (normalized.includes('typescript') || normalized.includes('ts')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="24" height="24" rx="4" fill="#3178C6" />
        <path d="M5 9.5H12M8.5 9.5V17" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.5 15.2C14.2 16.3 15.3 17 16.8 17C18.3 17 19.3 16.1 19.3 14.8C19.3 12.6 13.3 13.5 13.3 10.7C13.3 9.4 14.4 8.5 16.2 8.5C17.4 8.5 18.5 9.1 19.2 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  // 4. Tailwind CSS
  if (normalized.includes('tailwind')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#38BDF8" aria-hidden="true">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.335 6.182 14.974 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.335 13.382 8.974 12 6.001 12z" />
      </svg>
    );
  }

  // 5. HTML / CSS
  if (normalized.includes('html') || normalized.includes('css')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.8" aria-hidden="true">
        <path d="M4 3L6 19L12 21L18 19L20 3H4Z" stroke="#F97316" fill="rgba(249, 115, 22, 0.15)" />
        <path d="M16 7H8L8.5 11H15.5L15 15L12 16L9 15L8.8 13.5" stroke="#F97316" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 6. Node.js
  if (normalized.includes('node')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1.8" aria-hidden="true">
        <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" fill="rgba(34, 197, 94, 0.15)" stroke="#22C55E" />
        <path d="M12 6V18M7 9L17 15" stroke="#22C55E" strokeLinecap="round" />
      </svg>
    );
  }

  // 7. PostgreSQL
  if (normalized.includes('postgres')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12 3C7.5 3 4 5.5 4 8.5C4 11.5 7.5 14 12 14C16.5 14 20 11.5 20 8.5C20 5.5 16.5 3 12 3Z" stroke="#38BDF8" strokeWidth="1.5" fill="rgba(56, 189, 248, 0.2)" />
        <path d="M4 8.5V15.5C4 18.5 7.5 21 12 21C16.5 21 20 18.5 20 15.5V8.5" stroke="#38BDF8" strokeWidth="1.5" />
        <path d="M4 12C4 15 7.5 17.5 12 17.5C16.5 17.5 20 15 20 12" stroke="#38BDF8" strokeWidth="1.5" />
      </svg>
    );
  }

  // 8. Prisma ORM
  if (normalized.includes('prisma')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" strokeWidth="1.8" aria-hidden="true">
        <path d="M4.5 18.5L12 3.5L19.5 18.5L12 21.5L4.5 18.5Z" fill="rgba(45, 212, 191, 0.15)" />
        <path d="M12 3.5V21.5" stroke="#2DD4BF" />
      </svg>
    );
  }

  // 9. Docker
  if (normalized.includes('docker')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#0EA5E9" aria-hidden="true">
        <path d="M13 3h2v2h-2zm-3 0h2v2h-2zm-3 3h2v2H7zm3 0h2v2h-2zm3 0h2v2h-2zm3 0h2v2h-2zm-9 3h2v2H4zm3 0h2v2H7zm3 0h2v2h-2zm3 0h2v2h-2zm3 0h2v2h-2zm3 0h2v2h-2z" />
        <path d="M22.5 11c-.4-.3-1.4-.4-2.2 0-.2-.6-.7-1.1-1.3-1.4-.4-.2-1-.3-1.7-.1-.2-.6-.7-1.1-1.3-1.4-.6-.4-1.4-.5-2.2-.4-.2-.1-.5-.2-.8-.2H1v6.5C1 17.5 3.5 20 7 20h9c3.5 0 6.5-2.5 6.5-6.5 0-.9-.3-1.7-.8-2.3.4-.1.7-.2.8-.2z" opacity="0.9" />
      </svg>
    );
  }

  // 10. Ubuntu / Linux
  if (normalized.includes('ubuntu') || normalized.includes('linux')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="#EA580C" fill="rgba(234, 88, 12, 0.15)" />
        <circle cx="12" cy="5" r="1.5" fill="#EA580C" />
        <circle cx="6" cy="15.5" r="1.5" fill="#EA580C" />
        <circle cx="18" cy="15.5" r="1.5" fill="#EA580C" />
      </svg>
    );
  }

  // 11. Nginx
  if (normalized.includes('nginx')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="24" height="24" rx="4" fill="#009639" />
        <path d="M5.5 17V7L14 17V7M18.5 7V17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 12. Cloudflare
  if (normalized.includes('cloudflare')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#F38020" aria-hidden="true">
        <path d="M18.5 10.5c-.3-2.5-2.4-4.5-5-4.5-1.9 0-3.6 1.1-4.4 2.7C8.6 8.3 8 8.1 7.5 8.1 5 8.1 3 10.1 3 12.6c0 2.4 1.9 4.4 4.3 4.4h11.2c2 0 3.5-1.6 3.5-3.5 0-1.8-1.4-3.3-3.2-3.4-.1-.2-.2-.4-.3-.6z" />
      </svg>
    );
  }

  // 13. REST API / Route Handlers (Plug/API icon)
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22v-5" />
      <path d="M15 8V2" />
      <path d="M9 8V2" />
      <path d="M17 8a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1z" fill="rgba(168, 85, 247, 0.15)" />
    </svg>
  );
}
