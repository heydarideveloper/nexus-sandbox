import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { content } from '@/content';
import { usePrefersReducedMotion } from '@/lib/motion';
import { Card, Chip, DistrictBody, Section } from './ui';

export default function Identity() {
  const { profile } = content;
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse parallax for the hero block.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-5, 5]);

  return (
    <div
      ref={containerRef}
      onMouseMove={(e) => {
        if (reduced) return;
        const r = containerRef.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
    >
      <DistrictBody>
        <motion.div
          style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
          className="glass relative mb-10 overflow-hidden rounded-2xl p-8 text-center sm:p-12"
        >
          <IdentityParticles />
          <div className="relative">
            <p className="terminal-text text-[11px] tracking-[0.35em] text-neon uppercase">
              identity verified
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
              {profile.name}
            </h2>
            <p className="mt-2 text-base text-dim">{profile.headline}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {profile.roles.map((r, i) => (
                <motion.span
                  key={r}
                  className="hud-chip"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  {r}
                </motion.span>
              ))}
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-ink/85">
              {profile.summary}
            </p>
          </div>
        </motion.div>

        <Section title="the numbers are real" index={1}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {profile.stats.map((s, i) => (
              <Card key={s.id}>
                <Counter value={s.value} suffix={s.suffix} delay={i * 0.12} />
                <div className="terminal-text mt-1 text-[11px] text-dim uppercase">{s.label}</div>
                <p className="mt-2 text-xs leading-relaxed text-dim">{s.context}</p>
              </Card>
            ))}
            <Card accent="#22d3ee">
              <div className="text-3xl font-extrabold text-neon">∞</div>
              <div className="terminal-text mt-1 text-[11px] text-dim uppercase">Learning</div>
              <p className="mt-2 text-xs text-dim">
                The only counter that never stops. See the Learning Observatory.
              </p>
            </Card>
          </div>
        </Section>

        <Section title="operating principles" index={2} accent="#c084fc">
          <div className="grid gap-3 sm:grid-cols-2">
            <Card>
              <h4 className="text-sm font-bold text-ink">Identity statement</h4>
              <p className="mt-2 text-sm leading-relaxed text-dim italic">
                “{profile.identityStatement}”
              </p>
            </Card>
            <Card>
              <h4 className="text-sm font-bold text-ink">Leadership philosophy</h4>
              <p className="mt-2 text-sm leading-relaxed text-dim">
                “{profile.leadershipPhilosophy}”
              </p>
            </Card>
          </div>
        </Section>

        <Section title="channels" index={3} accent="#facc15">
          <div className="flex flex-wrap gap-2">
            <a
              href={`mailto:${profile.email}`}
              className="hud-chip transition-colors hover:text-neon"
            >
              ✉ {profile.email}
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="hud-chip transition-colors hover:text-neon"
            >
              ⌥ github/{profile.githubHandle}
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hud-chip transition-colors hover:text-neon"
            >
              in/{profile.linkedinHandle}
            </a>
            <Chip>{profile.location}</Chip>
          </div>
        </Section>
      </DistrictBody>
    </div>
  );
}

function Counter({ value, suffix, delay }: { value: number; suffix: string; delay: number }) {
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const start = performance.now() + delay * 1000;
    const duration = 1400;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, delay, reduced]);

  return (
    <div className="text-3xl font-extrabold text-ink tabular-nums">
      {display.toLocaleString()}
      <span className="text-neon">{suffix}</span>
    </div>
  );
}

/** Lightweight 2D particle canvas behind the hero card. */
function IdentityParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let raf = 0;
    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const dots = Array.from({ length: 45 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
      r: 0.6 + Math.random() * 1.6,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(34,211,238,0.5)';
      for (const d of dots) {
        d.x = (d.x + d.vx + 1) % 1;
        d.y = (d.y + d.vy + 1) % 1;
        ctx.beginPath();
        ctx.arc(d.x * canvas.width, d.y * canvas.height, d.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [reduced]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-60" aria-hidden />
  );
}
