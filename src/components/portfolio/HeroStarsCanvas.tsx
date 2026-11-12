'use client';

import { useEffect, useRef } from 'react';

interface StarDot {
  cx: number;
  cy: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  baseAlpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
}

export function HeroStarsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const cursor = {
      x: -9999,
      y: -9999,
      active: false,
      radius: 160,
    };

    // Palet warna polkadot hangat & modern di atas latar terang (Burnt Orange, Amber, Teal, Slate)
    const PALETTE = [
      { fill: '#EA580C', glow: 'rgba(234, 88, 12, 0.45)' }, // Burnt Orange Utama
      { fill: '#EA580C', glow: 'rgba(234, 88, 12, 0.45)' },
      { fill: '#F59E0B', glow: 'rgba(245, 158, 11, 0.40)' }, // Amber Gold
      { fill: '#FB923C', glow: 'rgba(251, 146, 60, 0.40)' }, // Warm Coral
      { fill: '#0D9488', glow: 'rgba(13, 148, 136, 0.40)' }, // Deep Teal
      { fill: '#78716C', glow: 'rgba(120, 113, 108, 0.35)' }, // Slate Stone
      { fill: '#A8A29E', glow: 'rgba(168, 162, 158, 0.35)' }, // Muted Warm Gray
    ];

    const dots: StarDot[] = [];
    const count = 75;

    let width = 0;
    let height = 0;

    const initDots = () => {
      dots.length = 0;
      for (let i = 0; i < count; i++) {
        // 65% polkadot di sisi kanan, 35% di sisi kiri
        const inRightSide = Math.random() < 0.65;
        let cx: number;
        let cy: number;

        if (inRightSide) {
          cx = width * 0.44 + Math.random() * (width * 0.53);
          cy = height * 0.08 + Math.random() * (height * 0.84);
        } else {
          cx = Math.random() * (width * 0.42);
          cy = Math.random() * height;
        }

        const p = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        const radius = 3.5 + Math.random() * 3.5;

        dots.push({
          cx,
          cy,
          px: cx,
          py: cy,
          vx: 0,
          vy: 0,
          radius,
          color: p.fill,
          glowColor: p.glow,
          baseAlpha: 0.85 + Math.random() * 0.15,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.02 + Math.random() * 0.03,
        });
      }
      (window as unknown as { __DEBUG_DOTS?: StarDot[] }).__DEBUG_DOTS = dots;
    };

    const handleResize = () => {
      const parent = canvas.parentElement;
      width = parent?.clientWidth || window.innerWidth || 1200;
      height = parent?.clientHeight || window.innerHeight || 800;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (dots.length === 0) {
        initDots();
      } else {
        dots.forEach((dot) => {
          const inRightSide = Math.random() < 0.65;
          if (inRightSide) {
            dot.cx = width * 0.44 + Math.random() * (width * 0.53);
            dot.cy = height * 0.08 + Math.random() * (height * 0.84);
          } else {
            dot.cx = Math.random() * (width * 0.42);
            dot.cy = Math.random() * height;
          }
          dot.px = dot.cx;
          dot.py = dot.cy;
          dot.vx = 0;
          dot.vy = 0;
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Listener mousemove global di window
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      cursor.x = e.clientX - rect.left;
      cursor.y = e.clientY - rect.top;
      cursor.active = true;
    };

    const handleMouseLeave = () => {
      cursor.active = false;
      cursor.x = -9999;
      cursor.y = -9999;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Render loop 60fps dengan fisika tolak kursor dan pegas persis kode Akmal
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const radiusSq = cursor.radius * cursor.radius;

      // 1. Gambar garis rasi bintang tipis saat dekat kursor
      if (cursor.active) {
        for (let i = 0; i < dots.length; i++) {
          for (let j = i + 1; j < dots.length; j++) {
            const d1 = dots[i];
            const d2 = dots[j];
            const distSq = (d1.px - d2.px) ** 2 + (d1.py - d2.py) ** 2;

            if (distSq < 13000) {
              const dCursorSq = (d1.px - cursor.x) ** 2 + (d1.py - cursor.y) ** 2;
              if (dCursorSq < radiusSq * 2.2) {
                const dist = Math.sqrt(distSq);
                const alpha = (1 - dist / 114) * 0.35;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(234, 88, 12, ${alpha})`;
                ctx.lineWidth = 1.2;
                ctx.moveTo(d1.px, d1.py);
                ctx.lineTo(d2.px, d2.py);
                ctx.stroke();
              }
            }
          }
        }
      }

      // 2. Update posisi & gambar polkadot
      dots.forEach((dot) => {
        // Formula Pegas Akmal: menarik kembali ke posisi asal (cx, cy)
        const rx = -0.08 * (dot.px - dot.cx);
        const ry = -0.08 * (dot.py - dot.cy);
        dot.vx = (dot.vx + rx) * 0.85;
        dot.vy = (dot.vy + ry) * 0.85;

        // Formula Gaya Tolak Kursor Akmal (repulsion saat mouse mendekat)
        if (cursor.active) {
          const dx = dot.px - cursor.x;
          const dy = dot.py - cursor.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < radiusSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / cursor.radius) * 5.2;
            dot.vx += (dx / dist) * force;
            dot.vy += (dy / dist) * force;
          }
        }

        dot.px += dot.vx;
        dot.py += dot.vy;

        // Efek kedekatan kursor: membesar & berpendar lebih hangat
        let currentRadius = dot.radius;
        let currentAlpha = dot.baseAlpha;

        if (cursor.active) {
          const dxOrigin = dot.cx - cursor.x;
          const dyOrigin = dot.cy - cursor.y;
          const distOriginSq = dxOrigin * dxOrigin + dyOrigin * dyOrigin;

          if (distOriginSq < radiusSq) {
            const factor = 1 - Math.sqrt(distOriginSq) / cursor.radius;
            currentRadius = dot.radius + factor * 3.2;
            currentAlpha = 1;
          }
        } else {
          dot.twinklePhase += dot.twinkleSpeed;
          currentAlpha = Math.max(0.65, dot.baseAlpha + Math.sin(dot.twinklePhase) * 0.15);
        }

        ctx.save();
        ctx.globalAlpha = currentAlpha;

        // Outer glow halo
        ctx.beginPath();
        ctx.arc(dot.px, dot.py, currentRadius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = dot.glowColor;
        ctx.fill();

        // Core dot solid
        ctx.beginPath();
        ctx.arc(dot.px, dot.py, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      style={{ width: '100%', height: '100%', display: 'block' }}
      aria-hidden="true"
    />
  );
}
