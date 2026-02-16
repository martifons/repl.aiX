'use client';

import React, { useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const UltraWowBackground = () => {
  const particlesInit = useCallback(async (engine: unknown) => {
    await loadFull(engine as Parameters<typeof loadFull>[0]);
  }, []);

  const yScroll = useMotionValue(0);
  const glowY = useTransform(yScroll, [0, 1000], [0, -60]);
  const glowOpacity = useTransform(yScroll, [0, 1000], [0.15, 0.3]);

  const handleScroll = () => yScroll.set(window.scrollY);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const setMouse = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    document.documentElement.style.setProperty('--mouse-x', '50%');
    document.documentElement.style.setProperty('--mouse-y', '50%');
    window.addEventListener('mousemove', setMouse);
    return () => window.removeEventListener('mousemove', setMouse);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
        background: '#ffffff',
      }}
    >
      {/* Glow azul gigante dinámico y reactivo al scroll */}
      <motion.div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          width: '220%',
          height: '220%',
          background:
            'radial-gradient(circle, rgba(29,161,242,0.15) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(300px)',
          transform: 'translateX(-50%)',
          y: glowY,
          opacity: glowOpacity,
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Partículas premium flotantes y reactivas */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fpsLimit: 60,
          particles: {
            number: { value: 50 },
            color: { value: '#1DA1F2' },
            shape: { type: 'circle' },
            opacity: { value: 0.1, random: true },
            size: { value: { min: 2, max: 5 }, random: true },
            move: {
              enable: true,
              speed: 0.35,
              direction: 'none',
              outMode: 'bounce',
            },
            links: {
              enable: true,
              distance: 160,
              color: '#1DA1F2',
              opacity: 0.08,
              width: 1,
            },
          },
          detectRetina: true,
          interactivity: {
            events: {
              onHover: { enable: true, mode: 'grab' },
              onClick: { enable: true, mode: 'repulse' },
            },
            modes: {
              grab: {
                distance: 100,
                links: { opacity: 0.15 },
              },
              repulse: { distance: 100, duration: 0.7 },
            },
          },
          background: { color: 'transparent' },
        }}
      />

      {/* Overlay de noise premium para profundidad */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '180px 180px',
          opacity: 0.03,
          pointerEvents: 'none',
        }}
      />

      {/* Glow reactivo al cursor (premium) */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(29,161,242,0.06), transparent 55%)',
        }}
      />
    </div>
  );
};

export default UltraWowBackground;
