'use client';

import { BackgroundParticles } from '@/components/BackgroundParticles';

/* SVG noise pattern as data URL - very subtle grain */
const NOISE_DATA_URL =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function GlobalBackground() {
  return (
    <div
      className="fixed inset-0 z-0 min-h-screen w-full"
      aria-hidden
    >
      {/* 1. Base: pure white */}
      <div
        className="absolute inset-0 h-full w-full"
        style={{ backgroundColor: '#ffffff' }}
      />

      {/* 2. Blue radial glow - Twitter blue, very soft, top center */}
      <div
        className="absolute inset-0 h-full w-full"
        style={{
          background:
            'radial-gradient(ellipse 120% 80% at 50% -20%, rgba(29, 161, 242, 0.14) 0%, rgba(29, 161, 242, 0.06) 35%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* 3. Particles */}
      <div className="absolute inset-0 h-full w-full">
        <BackgroundParticles />
      </div>

      {/* 4. Noise / grain overlay - almost imperceptible */}
      <div
        className="absolute inset-0 h-full w-full pointer-events-none"
        style={{
          backgroundImage: NOISE_DATA_URL,
          backgroundRepeat: 'repeat',
          backgroundSize: '180px 180px',
          opacity: 0.035,
        }}
      />
    </div>
  );
}
