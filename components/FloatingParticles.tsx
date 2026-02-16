'use client';

const PARTICLE_COUNT = 36;

const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  left: `${(i * 7 + 3) % 98}%`,
  top: `${(i * 11 + 5) % 95}%`,
  size: 2 + (i % 3),
  delay: `${(i % 5) * 2}s`,
  duration: 18 + (i % 4) * 2,
  anim: (['animate-float-1', 'animate-float-2', 'animate-float-3'] as const)[i % 3],
  opacity: 0.2 + (i % 3) * 0.06,
}));

export function FloatingParticles() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute rounded-full bg-white/50 will-change-transform ${p.anim}`}
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            boxShadow: '0 0 6px rgba(255,255,255,0.3)',
            animationDelay: p.delay,
          }}
        />
      ))}
      {particles.slice(0, 20).map((p) => (
        <div
          key={`g-${p.id}`}
          className={`absolute rounded-full bg-gray-400/20 will-change-transform ${p.anim}`}
          style={{
            left: `calc(${p.left} + 12%)`,
            top: `calc(${p.top} + 8%)`,
            width: Math.max(1.5, p.size - 0.5),
            height: Math.max(1.5, p.size - 0.5),
            opacity: p.opacity * 0.6,
            animationDelay: `${Number(p.delay.replace('s', '')) + 1}s`,
          }}
        />
      ))}
    </div>
  );
}
