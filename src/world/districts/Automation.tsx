import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { content } from '@/content';
import { DistrictBody } from './ui';

/**
 * Automation Center — a CI-style board of pipelines he actually built.
 * Stages light up in sequence, looping like a live operations wall.
 */
export default function Automation() {
  return (
    <DistrictBody>
      <p className="mb-6 text-sm text-dim">
        Every pipeline here shipped in a real system — no imaginary bots. Watch them run.
      </p>
      <div className="space-y-4">
        {content.automations.map((a, i) => (
          <Pipeline key={a.id} index={i} {...a} />
        ))}
      </div>
    </DistrictBody>
  );
}

function Pipeline({
  name,
  origin,
  description,
  stages,
  cadence,
  index,
}: {
  name: string;
  origin: string;
  description: string;
  stages: string[];
  cadence: string;
  index: number;
}) {
  const [active, setActive] = useState(0);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => {
        setActive((a) => {
          if (a + 1 >= stages.length) {
            setCycles((c) => c + 1);
            return 0;
          }
          return a + 1;
        });
      },
      900 + index * 130,
    );
    return () => clearInterval(t);
  }, [stages.length, index]);

  const running = active < stages.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="glass rounded-xl p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <motion.span
            className={`inline-block h-2.5 w-2.5 rounded-full ${running ? 'bg-emerald' : 'bg-neon'}`}
            animate={running ? { opacity: [1, 0.4, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
            aria-hidden
          />
          <h3 className="text-sm font-bold text-ink">{name}</h3>
          <span className="hud-chip">{origin}</span>
        </div>
        <span className="terminal-text text-[10px] text-dim">
          {cadence} · {cycles} runs this session
        </span>
      </div>
      <p className="mt-1.5 text-xs text-dim">{description}</p>

      <ol className="mt-3 flex flex-col items-stretch gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-1.5" aria-label={`${name} stages`}>
        {stages.map((stage, i) => (
          <li key={stage} className="flex flex-col items-stretch gap-1 sm:flex-row sm:items-center sm:gap-1.5">
            <span
              className={`terminal-text rounded-md border px-2.5 py-2 text-[10px] transition-all duration-300 sm:px-2 sm:py-1 ${
                i < active
                  ? 'border-emerald/60 text-emerald'
                  : i === active
                    ? 'border-emerald bg-emerald/15 text-emerald shadow-[0_0_10px_#34d39940]'
                    : 'border-line text-dim'
              }`}
            >
              {i < active ? '✓ ' : i === active ? '▸ ' : ''}
              {stage}
            </span>
            {i < stages.length - 1 && (
              <>
                <span
                  className={`hidden text-center text-[10px] sm:inline ${i < active ? 'text-emerald' : 'text-line'}`}
                  aria-hidden
                >
                  →
                </span>
                <span className="text-center text-[10px] text-line sm:hidden" aria-hidden>
                  ↓
                </span>
              </>
            )}
          </li>
        ))}
      </ol>
    </motion.div>
  );
}
