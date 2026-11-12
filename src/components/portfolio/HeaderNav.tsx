'use client';

import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

export function HeaderNav() {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220;

      for (const item of NAV_ITEMS) {
        const id = item.href.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.href);
            return;
          }
        }
      }

      if (window.scrollY < 200) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ul className="flex items-center gap-2.5 sm:gap-5 md:gap-7 text-xs sm:text-sm font-medium">
      {NAV_ITEMS.map((item) => {
        const isActive = activeSection === item.href;

        return (
          <li key={item.href} className="relative py-1">
            <a
              href={item.href}
              className={`transition-colors ${
                isActive
                  ? 'text-accent font-bold'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {item.label}
            </a>

            {isActive && (
              <span
                className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-accent transition-all"
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}
