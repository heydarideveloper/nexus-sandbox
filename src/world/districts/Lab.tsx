import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { content, type Project } from '@/content';
import { Chip, DistrictBody } from './ui';
import { SlotsDemo } from './demos/SlotsDemo';
import { RiskEngineDemo } from './demos/RiskEngineDemo';
import { FsrsDemo } from './demos/FsrsDemo';

const KIND_LABEL: Record<Project['kind'], string> = {
  product: 'product',
  platform: 'platform',
  systems: 'systems',
  mobile: 'mobile',
};

/** Innovation Lab — projects as workbench containers; opening one powers it up. */
export default function Lab() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = content.projects.find((p) => p.id === openId) ?? null;

  return (
    <DistrictBody>
      <p className="mb-6 text-sm text-dim">
        Every container holds a real system he built. Open one — some of them still run.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {content.projects.map((p, i) => (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            onClick={() => setOpenId(p.id)}
            className="glass group relative overflow-hidden rounded-xl p-5 text-left transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_-8px_#f59e0b]"
          >
            <div
              className="absolute inset-x-0 top-0 h-0.5 opacity-40 transition-opacity group-hover:opacity-100"
              style={{ background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)' }}
              aria-hidden
            />
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-lg font-extrabold text-ink">{p.name}</h3>
              <span className="hud-chip">{KIND_LABEL[p.kind]}</span>
            </div>
            <p className="terminal-text mt-0.5 text-[11px] text-amber">{p.period}</p>
            <p className="mt-2 line-clamp-3 text-sm text-dim">{p.summary}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.tech.slice(0, 5).map((t) => (
                <span key={t} className="terminal-text text-[10px] text-dim">
                  {t}
                </span>
              ))}
            </div>
            <div className="terminal-text mt-3 text-[11px] text-amber opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
              {p.demo !== 'none' ? '▸ open container — live demo inside' : '▸ open container'}
            </div>
          </motion.button>
        ))}
      </div>

      {/* opened container */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end bg-void/80 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4"
            onClick={() => setOpenId(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`${open.name} details`}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="glass district-scroll max-h-[min(92dvh,100%)] w-full max-w-3xl overflow-y-auto rounded-t-2xl border-t-2 border-t-amber p-4 sm:max-h-[min(88dvh,100%)] sm:rounded-2xl sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 -mx-4 mb-3 flex items-start justify-between gap-3 border-b border-line bg-panel/95 px-4 pb-3 backdrop-blur-sm sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-extrabold text-ink sm:text-2xl">{open.name}</h3>
                  <p className="terminal-text text-xs text-amber">
                    {open.period} · {open.role}
                  </p>
                </div>
                <button
                  className="touch-target flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line text-lg text-dim active:border-rose active:text-rose"
                  onClick={() => setOpenId(null)}
                  aria-label={`Close ${open.name}`}
                >
                  ✕
                </button>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-ink/85">{open.summary}</p>

              {open.demo === 'slots' && (
                <div className="mt-5">
                  <SlotsDemo />
                </div>
              )}
              {open.demo === 'risk-engine' && (
                <div className="mt-5">
                  <RiskEngineDemo />
                </div>
              )}
              {open.demo === 'fsrs' && (
                <div className="mt-5">
                  <FsrsDemo />
                </div>
              )}

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="terminal-text mb-1.5 text-[11px] tracking-[0.2em] text-rose uppercase">
                    problems
                  </h4>
                  <ul className="list-disc space-y-1 pl-4 text-xs text-dim">
                    {open.problems.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="terminal-text mb-1.5 text-[11px] tracking-[0.2em] text-emerald uppercase">
                    solutions
                  </h4>
                  <ul className="list-disc space-y-1 pl-4 text-xs text-dim">
                    {open.solutions.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <h4 className="terminal-text mt-5 mb-1.5 text-[11px] tracking-[0.2em] text-neon uppercase">
                architecture
              </h4>
              {open.architecture.map((a) => (
                <p
                  key={a}
                  className="terminal-text mb-1 rounded border border-line bg-void/50 p-2 text-[11px] text-ink/80"
                >
                  {a}
                </p>
              ))}

              <h4 className="terminal-text mt-5 mb-1.5 text-[11px] tracking-[0.2em] text-gold uppercase">
                lessons
              </h4>
              <ul className="list-disc space-y-1 pl-4 text-xs text-dim">
                {open.lessons.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {open.tech.map((t) => (
                  <Chip key={t} accent="#f59e0b">
                    {t}
                  </Chip>
                ))}
                {open.metrics.map((m) => (
                  <Chip key={m.label}>
                    {m.label}: {m.value}
                  </Chip>
                ))}
                {open.liveUrl && (
                  <a
                    href={open.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-amber px-3 py-1.5 text-xs font-bold text-void transition-transform hover:scale-105"
                  >
                    open live product ↗
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DistrictBody>
  );
}
