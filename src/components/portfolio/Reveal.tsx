'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
};

export function Reveal({ children, className = '', delayMs = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const frame = requestAnimationFrame(() => setMounted(true));

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -24px 0px',
      },
    );

    observer.observe(element);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  const transitionStyle = mounted
    ? {
        transitionProperty: 'opacity, transform',
        transitionDuration: '500ms',
        transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        transitionDelay: `${delayMs}ms`,
      }
    : undefined;

  const animationClass = mounted
    ? visible
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-5 pointer-events-none motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:pointer-events-auto'
    : '';

  return (
    <div
      ref={ref}
      style={transitionStyle}
      className={`motion-reduce:transition-none ${animationClass} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
