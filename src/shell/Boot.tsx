import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useWorld } from '@/state/world';
import { usePrefersReducedMotion } from '@/lib/motion';

const BOOT_LINES = [
  'NEXUS SANDBOX v1.0',
  'Booting runtime...',
  'Authenticating visitor... ok',
  'Loading experience database... 10 years found',
  'Loading career memory... 6 stations mapped',
  'Loading knowledge graph... 25 nodes linked',
  'Loading AI modules... twin persona ready',
  'Loading automation engine... 6 pipelines',
  'Loading system architecture... live',
  'Mounting world... done',
  '',
  'System ready. This is not a resume.',
];

const LINE_DELAY_MS = 340;

export function Boot() {
  const finishBoot = useWorld((s) => s.finishBoot);
  const reduced = usePrefersReducedMotion();
  const [lineCount, setLineCount] = useState(reduced ? BOOT_LINES.length : 0);
  const done = lineCount >= BOOT_LINES.length;
  const doneRef = useRef(false);

  useEffect(() => {
    if (reduced) return;
    if (lineCount >= BOOT_LINES.length) return;
    const t = setTimeout(() => setLineCount((n) => n + 1), LINE_DELAY_MS);
    return () => clearTimeout(t);
  }, [lineCount, reduced]);

  useEffect(() => {
    if (!done || doneRef.current) return;
    doneRef.current = true;
    const t = setTimeout(finishBoot, reduced ? 150 : 700);
    return () => clearTimeout(t);
  }, [done, finishBoot, reduced]);

  const skip = () => {
    if (!doneRef.current) {
      doneRef.current = true;
      finishBoot();
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') skip();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progress = Math.min(100, Math.round((lineCount / BOOT_LINES.length) * 100));

  return (
    <motion.div
      className="scanlines relative flex h-full flex-col items-center justify-center bg-void px-6"
      exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.5 } }}
      role="status"
      aria-label="Nexus Sandbox is booting"
      onClick={skip}
    >
      <div className="terminal-text w-full max-w-xl text-sm text-emerald sm:text-base">
        <div className="mb-6 text-neon">
          {'█'.repeat(Math.round(progress / 4)).padEnd(25, '░')} {progress}%
        </div>
        {BOOT_LINES.slice(0, lineCount).map((line, i) => (
          <div
            key={i}
            className={line.startsWith('NEXUS') ? 'mb-2 font-bold text-ink' : 'text-dim'}
          >
            {line.startsWith('NEXUS') ? line : `> ${line}`}
          </div>
        ))}
        <span className="cursor-blink text-neon">▮</span>
      </div>
      <button
        className="no-print terminal-text absolute bottom-8 rounded border border-line px-4 py-1.5 text-xs text-dim transition-colors hover:border-neon hover:text-neon"
        onClick={skip}
      >
        skip [enter]
      </button>
    </motion.div>
  );
}
