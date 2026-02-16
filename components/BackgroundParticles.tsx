'use client';

import { useRef, useEffect, useMemo } from 'react';

const PARTICLE_COUNT = 18;
const TWITTER_BLUE = '29, 161, 242'; // #1DA1F2

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  vx: number;
  vy: number;
  phase: number;
}

function initParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    x: (i * 0.053 + 0.1) % 1,
    y: (i * 0.071 + 0.05) % 1,
    size: 2 + (i % 3),
    opacity: 0.06 + (i % 4) * 0.02,
    vx: (Math.sin(i * 0.7) * 0.00008),
    vy: (Math.cos(i * 0.5) * -0.00006),
    phase: i * 0.4,
  }));
}

export function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useMemo(initParticles, []);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setSize();
    window.addEventListener('resize', setSize);

    const tick = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
        p.x = Math.max(0, Math.min(1, p.x));
        p.y = Math.max(0, Math.min(1, p.y));

        const x = p.x * w;
        const y = p.y * h;
        const size = p.size;
        const opacity = p.opacity * (0.7 + 0.3 * Math.sin(Date.now() * 0.0005 + p.phase));

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${TWITTER_BLUE}, ${opacity})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', setSize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [particles]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
      style={{ display: 'block' }}
    />
  );
}
