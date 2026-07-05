import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { rise } from '@/lib/motion';

export function Section(props: {
  title: string;
  accent?: string;
  children: ReactNode;
  index?: number;
}) {
  return (
    <motion.section
      variants={rise}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      custom={props.index ?? 0}
      className="mb-8"
    >
      <h3
        className="terminal-text mb-3 text-xs font-bold tracking-[0.25em] uppercase"
        style={{ color: props.accent ?? 'var(--color-neon)' }}
      >
        {props.title}
      </h3>
      {props.children}
    </motion.section>
  );
}

export function Chip({ children, accent }: { children: ReactNode; accent?: string }) {
  return (
    <span className="hud-chip" style={accent ? { borderColor: accent, color: accent } : undefined}>
      {children}
    </span>
  );
}

export function Card({ children, accent }: { children: ReactNode; accent?: string }) {
  return (
    <div
      className="glass rounded-xl p-4"
      style={accent ? { borderTop: `2px solid ${accent}` } : undefined}
    >
      {children}
    </div>
  );
}

export function DistrictBody({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-4xl px-4 py-4 sm:px-8 sm:py-6">{children}</div>;
}

export function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-line" aria-hidden>
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
