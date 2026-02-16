'use client';

import React, { useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const StarryBackground = () => {
  const particlesInit = useCallback(async (main: unknown) => {
    await loadFull(main as Parameters<typeof loadFull>[0]);
  }, []);

  const scrollY = useMotionValue(0);
  const parallaxY = useTransform(scrollY, [0, 800, 2000], [0, 25, 60]);

  useEffect(() => {
    const handleScroll = () => scrollY.set(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY]);

  return (
    <div
      className="fixed inset-0 -z-[1] overflow-hidden"
      style={{ background: '#ffffff' }}
      aria-hidden
    >
      {/* Capa base: blanco puro */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: '#ffffff' }}
      />

      {/* Glow sutil superior: profundidad tipo cielo minimalista */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 140% 90% at 50% -30%, rgba(29, 161, 242, 0.08) 0%, rgba(29, 161, 242, 0.02) 45%, transparent 70%)',
        }}
      />

      {/* Contenedor de estrellas con parallax suave al scroll */}
      <motion.div
        className="absolute inset-0"
        style={{ y: parallaxY }}
      >
        <Particles
          id="starry-background"
          init={particlesInit}
          options={{
            fpsLimit: 60,
            fullScreen: { enable: false },
            background: { color: 'transparent' },
            particles: {
              number: {
                value: 110,
                density: {
                  enable: true,
                  width: 1920,
                  height: 1080,
                  area: 900,
                },
              },
              color: { value: '#1DA1F2' },
              shape: { type: 'circle' },
              opacity: {
                value: { min: 0.15, max: 0.55 },
                random: { enable: true, minimumValue: 0.12 },
                animation: {
                  enable: true,
                  minimumValue: 0.1,
                  speed: 0.6,
                  sync: false,
                },
              },
              size: {
                value: { min: 2, max: 4.5 },
              },
              move: {
                enable: true,
                speed: { min: 0.12, max: 0.28 },
                direction: 'none',
                random: true,
                straight: false,
                outMode: 'out',
                warp: false,
              },
              links: { enable: false },
              stroke: {
                width: 0,
              },
              twinkle: {
                particles: {
                  enable: true,
                  frequency: 0.03,
                  opacity: { min: 0.3, max: 0.8 },
                },
              },
            },
            interactivity: {
              events: {
                onHover: { enable: true, mode: 'repulse' },
                onClick: { enable: true, mode: 'repulse' },
              },
              modes: {
                repulse: {
                  distance: 100,
                  duration: 0.5,
                  factor: 0.5,
                  speed: 0.8,
                },
              },
            },
            detectRetina: true,
          }}
        />
      </motion.div>

      {/* Overlay de ruido muy sutil para textura premium */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />
    </div>
  );
};

export default StarryBackground;
