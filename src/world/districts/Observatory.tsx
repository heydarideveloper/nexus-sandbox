import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { content, type LearningItem } from '@/content';
import { Bar, Card, DistrictBody, Section } from './ui';

/**
 * Learning Observatory — satellites in orbit, honest progress bars.
 * Also hosts the AI Research Lab experiments (same "always learning" story).
 */
export default function Observatory() {
  const [selected, setSelected] = useState<LearningItem | null>(null);

  return (
    <DistrictBody>
      <p className="mb-6 text-sm text-dim">
        Most portfolios claim expertise. This one shows the training runs. These numbers are
        deliberately conservative — green means growing, not finished.
      </p>

      {/* orbit visualization */}
      <div className="relative mx-auto mb-8 hidden h-64 max-w-lg sm:block" aria-hidden>
        <div className="absolute top-1/2 left-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald/20 shadow-[0_0_40px_#34d39960]">
          <div className="flex h-full items-center justify-center text-2xl">🧠</div>
        </div>
        {content.learning.map((l, i) => {
          const orbitR = 60 + i * 24;
          return (
            <motion.div
              key={l.id}
              className="absolute top-1/2 left-1/2"
              animate={{ rotate: 360 }}
              transition={{ duration: 22 + i * 9, repeat: Infinity, ease: 'linear' }}
              style={{
                width: orbitR * 2,
                height: orbitR * 2,
                marginLeft: -orbitR,
                marginTop: -orbitR,
              }}
            >
              <button
                className="terminal-text absolute -top-2 left-1/2 rounded-full border border-emerald bg-void px-2 py-0.5 text-[9px] whitespace-nowrap text-emerald transition-transform hover:scale-110"
                style={{ pointerEvents: 'auto' }}
                onClick={() => setSelected(l)}
                tabIndex={-1}
              >
                {l.label} · {l.progress}%
              </button>
              <div className="absolute inset-0 rounded-full border border-line/50" />
            </motion.div>
          );
        })}
      </div>

      <Section title="currently learning" accent="#34d399">
        <div className="space-y-3">
          {content.learning.map((l) => (
            <button
              key={l.id}
              onClick={() => setSelected(selected?.id === l.id ? null : l)}
              className="glass w-full rounded-xl p-4 text-left transition-transform hover:-translate-y-0.5"
              aria-expanded={selected?.id === l.id}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-bold text-ink">{l.label}</span>
                <span className="terminal-text text-xs text-emerald">{l.progress}%</span>
              </div>
              <div className="mt-2">
                <Bar value={l.progress} color="#34d399" />
              </div>
              <AnimatePresence>
                {selected?.id === l.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 grid gap-3 border-t border-line pt-3 sm:grid-cols-2">
                      <div>
                        <h5 className="terminal-text text-[10px] tracking-[0.2em] text-emerald uppercase">
                          why
                        </h5>
                        <p className="mt-1 text-xs leading-relaxed text-dim">{l.why}</p>
                        <h5 className="terminal-text mt-3 text-[10px] tracking-[0.2em] text-neon uppercase">
                          resources
                        </h5>
                        <ul className="mt-1 list-disc pl-4 text-xs text-dim">
                          {l.resources.map((r) => (
                            <li key={r}>{r}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="terminal-text text-[10px] tracking-[0.2em] text-amber uppercase">
                          real experiments
                        </h5>
                        <ul className="mt-1 list-disc pl-4 text-xs text-dim">
                          {l.experiments.map((e) => (
                            <li key={e}>{e}</li>
                          ))}
                        </ul>
                        <h5 className="terminal-text mt-3 text-[10px] tracking-[0.2em] text-violet uppercase">
                          future
                        </h5>
                        <ul className="mt-1 list-disc pl-4 text-xs text-dim">
                          {l.futureIdeas.map((f) => (
                            <li key={f}>{f}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
      </Section>

      <Section title="research lab — experiments" accent="#818cf8" index={1}>
        <div className="grid gap-3 sm:grid-cols-2">
          {content.experiments.map((x) => (
            <Card key={x.id} accent="#818cf8">
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="text-sm font-bold text-ink">{x.title}</h4>
                <span
                  className="hud-chip"
                  style={{
                    color: x.status === 'shipped' ? '#34d399' : '#f59e0b',
                    borderColor: x.status === 'shipped' ? '#34d399' : '#f59e0b',
                  }}
                >
                  {x.status}
                </span>
              </div>
              <p className="terminal-text mt-0.5 text-[10px] text-indigo">{x.area}</p>
              <dl className="mt-2 space-y-1.5 text-xs">
                <div>
                  <dt className="terminal-text inline text-[10px] text-rose uppercase">
                    problem ·{' '}
                  </dt>
                  <dd className="inline text-dim">{x.problem}</dd>
                </div>
                <div>
                  <dt className="terminal-text inline text-[10px] text-neon uppercase">
                    hypothesis ·{' '}
                  </dt>
                  <dd className="inline text-dim">{x.hypothesis}</dd>
                </div>
                <div>
                  <dt className="terminal-text inline text-[10px] text-emerald uppercase">
                    result ·{' '}
                  </dt>
                  <dd className="inline text-dim">{x.results}</dd>
                </div>
                <div>
                  <dt className="terminal-text inline text-[10px] text-violet uppercase">
                    next ·{' '}
                  </dt>
                  <dd className="inline text-dim">{x.future}</dd>
                </div>
              </dl>
            </Card>
          ))}
        </div>
      </Section>
    </DistrictBody>
  );
}
