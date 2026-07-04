import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { content, type Experience } from '@/content';
import { Chip, DistrictBody } from './ui';

/** Career as a metro line: newest stations first, each themed by its domain. */
export default function Career() {
  const stations = content.experiences;
  const [openId, setOpenId] = useState<string | null>(stations[0]?.id ?? null);

  return (
    <DistrictBody>
      <p className="mb-8 text-sm text-dim">
        Ten years as a transit map. Every station is a real company with real numbers — step off the
        train anywhere.
      </p>

      <div className="relative">
        {/* the line */}
        <div
          className="absolute top-2 bottom-2 left-[13px] w-1 rounded-full bg-gradient-to-b from-neon via-azure to-line sm:left-[15px]"
          aria-hidden
        >
          <motion.div
            className="absolute -left-1 h-3 w-3 rounded-full bg-neon shadow-[0_0_12px_#22d3ee]"
            animate={{ top: ['2%', '96%', '2%'] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
            aria-hidden
          />
        </div>

        <ol className="space-y-4">
          {stations.map((exp, i) => (
            <Station
              key={exp.id}
              exp={exp}
              index={i}
              open={openId === exp.id}
              onToggle={() => setOpenId(openId === exp.id ? null : exp.id)}
            />
          ))}
        </ol>
      </div>
    </DistrictBody>
  );
}

function Station({
  exp,
  index,
  open,
  onToggle,
}: {
  exp: Experience;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="relative pl-10 sm:pl-12"
    >
      {/* station dot */}
      <span
        className="absolute top-4 left-1.5 z-10 h-6 w-6 rounded-full border-4 border-void sm:left-2"
        style={{
          background: exp.theme.accent,
          boxShadow: open ? `0 0 16px ${exp.theme.accent}` : undefined,
        }}
        aria-hidden
      />

      <button
        onClick={onToggle}
        aria-expanded={open}
        className="glass w-full rounded-xl p-4 text-left transition-transform hover:-translate-y-0.5"
        style={{ borderLeft: `3px solid ${exp.theme.accent}` }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-lg font-extrabold text-ink">{exp.company}</h3>
          <span className="terminal-text text-xs text-dim">
            {exp.period.from} – {exp.period.to ?? 'present'}
          </span>
        </div>
        <p className="text-sm text-dim">{exp.tagline}</p>
        <p className="terminal-text mt-1 text-[11px]" style={{ color: exp.theme.accent }}>
          {exp.role} · {exp.domain}
        </p>
        <p className="mt-2 text-xs text-dim italic">{exp.theme.mood}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {exp.metrics.map((m) => (
            <Chip key={m.label} accent={exp.theme.accent}>
              {m.label}: {m.value}
            </Chip>
          ))}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 ml-1 grid gap-3 rounded-xl border border-line bg-panel/40 p-4 sm:grid-cols-2">
              <div>
                <h4 className="terminal-text mb-1.5 text-[11px] tracking-[0.2em] text-rose uppercase">
                  problems
                </h4>
                <ul className="list-disc space-y-1 pl-4 text-xs text-dim">
                  {exp.problems.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="terminal-text mb-1.5 text-[11px] tracking-[0.2em] text-neon uppercase">
                  architecture
                </h4>
                <ul className="list-disc space-y-1 pl-4 text-xs text-dim">
                  {exp.architecture.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
              <div className="sm:col-span-2">
                <h4 className="terminal-text mb-1.5 text-[11px] tracking-[0.2em] text-ink uppercase">
                  what he did
                </h4>
                <ul className="list-disc space-y-1 pl-4 text-xs text-ink/85">
                  {exp.bullets.map((b) => (
                    <li key={b.text}>{b.text}</li>
                  ))}
                </ul>
              </div>
              <div className="sm:col-span-2">
                <h4 className="terminal-text mb-1.5 text-[11px] tracking-[0.2em] text-emerald uppercase">
                  lessons learned
                </h4>
                <ul className="list-disc space-y-1 pl-4 text-xs text-dim">
                  {exp.lessons.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
                {exp.tech.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
                {exp.liveUrl && (
                  <a
                    href={exp.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="terminal-text text-xs text-neon underline-offset-4 hover:underline"
                  >
                    live ↗
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
