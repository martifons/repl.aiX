'use client';

import React, { useRef, useEffect, useCallback } from 'react';

/**
 * Fondo de partículas premium tipo espacial.
 * Todas las opciones visuales se ajustan en CONFIG (número, tamaño, velocidad, glow, cursor, parallax).
 */
const CONFIG = {
  numParticles: 140,
  sizeMin: 2,
  sizeMax: 4.5,
  speedMin: 0.15,
  speedMax: 0.5,
  opacityMin: 0.2,
  opacityMax: 0.6,
  glowBlur: 8,
  layers: 3,
  color: '29, 161, 242',
  cursorRadius: 180,
  cursorStrength: 0.6,
  parallaxFactor: 0.02,
} as const;

interface ParticleConfig {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  layer: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ParticleConfig[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const scrollRef = useRef(0);
  const rafRef = useRef<number>(0);

  const initParticles = useCallback((width: number, height: number) => {
    const arr: ParticleConfig[] = [];
    for (let i = 0; i < CONFIG.numParticles; i++) {
      const layer = 1 + (i % CONFIG.layers);
      const layerFactor = 0.4 + (layer / CONFIG.layers) * 0.6;
      arr.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: CONFIG.sizeMin + Math.random() * (CONFIG.sizeMax - CONFIG.sizeMin),
        speedX: (CONFIG.speedMin + Math.random() * (CONFIG.speedMax - CONFIG.speedMin)) * (Math.random() > 0.5 ? 1 : -1) * layerFactor,
        speedY: (CONFIG.speedMin + Math.random() * (CONFIG.speedMax - CONFIG.speedMin)) * (Math.random() > 0.5 ? 1 : -1) * layerFactor,
        opacity: CONFIG.opacityMin + Math.random() * (CONFIG.opacityMax - CONFIG.opacityMin),
        layer,
      });
    }
    return arr;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particlesRef.current = initParticles(w, h);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    setSize();
    window.addEventListener('resize', setSize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const parallaxOffset = scrollRef.current * CONFIG.parallaxFactor;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, -50, w, h + 100);

      particlesRef.current.forEach((p) => {
        let vx = p.speedX;
        let vy = p.speedY;

        if (mx >= 0 && my >= 0) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONFIG.cursorRadius && dist > 0) {
            const force = (1 - dist / CONFIG.cursorRadius) * CONFIG.cursorStrength * (p.layer / CONFIG.layers);
            vx += (dx / dist) * force;
            vy += (dy / dist) * force;
          }
        }

        p.x += vx;
        p.y += vy;

        if (p.x < -p.size * 2) p.x = w + p.size;
        if (p.x > w + p.size * 2) p.x = -p.size;
        if (p.y < -p.size * 2) p.y = h + p.size;
        if (p.y > h + p.size * 2) p.y = -p.size;

        const drawY = p.y - parallaxOffset;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = CONFIG.glowBlur;
        ctx.shadowColor = `rgba(${CONFIG.color}, 0.55)`;
        ctx.fillStyle = `rgba(${CONFIG.color}, ${0.3 + p.opacity * 0.5})`;
        ctx.beginPath();
        ctx.arc(p.x, drawY, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', setSize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [initParticles]);

  return (
    <div
      className="fixed inset-0 -z-[1] overflow-hidden"
      style={{ background: '#ffffff' }}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[#ffffff]" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 140% 90% at 50% -30%, rgba(29, 161, 242, 0.07) 0%, rgba(29, 161, 242, 0.02) 45%, transparent 70%)',
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ display: 'block' }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />
    </div>
  );
}
