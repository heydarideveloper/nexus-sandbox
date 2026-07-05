import { useState } from 'react';
import { motion } from 'framer-motion';

const CORES = [
  'High-Risk Areas',
  'Birthplace',
  'Citizenship',
  'Live Transactions',
  'User Profile',
] as const;

type CoreState = 'idle' | 'working' | 'done' | 'crashed';

/**
 * The banking risk engine in miniature: five isolated cores evaluate in parallel;
 * one can crash without taking the others down — the orchestrator still produces a score.
 */
export function RiskEngineDemo() {
  const [states, setStates] = useState<CoreState[]>(Array(5).fill('idle'));
  const [scores, setScores] = useState<(number | null)[]>(Array(5).fill(null));
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [chaos, setChaos] = useState(false);

  const run = async () => {
    if (running) return;
    setRunning(true);
    setFinalScore(null);
    setStates(Array(5).fill('working'));
    setScores(Array(5).fill(null));

    const crashIndex = chaos ? Math.floor(Math.random() * 5) : -1;
    const results = await Promise.all(
      CORES.map(
        (_, i) =>
          new Promise<number | null>((resolve) => {
            setTimeout(
              () => {
                if (i === crashIndex) {
                  setStates((s) => replace(s, i, 'crashed'));
                  resolve(null); // isolated: the crash never leaves the core
                } else {
                  const score = Math.round(10 + Math.random() * 80);
                  setStates((s) => replace(s, i, 'done'));
                  setScores((s) => replace(s, i, score));
                  resolve(score);
                }
              },
              500 + Math.random() * 1400,
            );
          }),
      ),
    );

    const valid = results.filter((r): r is number => r !== null);
    setFinalScore(Math.round(valid.reduce((a, b) => a + b, 0) / valid.length));
    setRunning(false);
  };

  return (
    <div className="rounded-xl border border-line bg-void/60 p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <span className="terminal-text text-[11px] text-indigo uppercase">
          live demo — parallel risk computation
        </span>
        <label className="terminal-text flex cursor-pointer items-center gap-2 text-[11px] text-dim">
          <input
            type="checkbox"
            checked={chaos}
            onChange={(e) => setChaos(e.target.checked)}
            className="accent-rose"
          />
          chaos mode (crash a core)
        </label>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-5 sm:gap-1.5">
        {CORES.map((name, i) => (
          <div
            key={name}
            className={`rounded-lg border p-2 text-center transition-colors ${
              states[i] === 'crashed'
                ? 'border-rose bg-rose/10'
                : states[i] === 'done'
                  ? 'border-indigo bg-indigo/10'
                  : 'border-line bg-panel'
            }`}
          >
            <div className="terminal-text text-[9px] break-words text-dim">{name}</div>
            <div className="mt-1 text-sm font-bold">
              {states[i] === 'working' && (
                <motion.span
                  className="text-indigo"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 0.7, repeat: Infinity }}
                >
                  ⋯
                </motion.span>
              )}
              {states[i] === 'done' && <span className="text-indigo">{scores[i]}</span>}
              {states[i] === 'crashed' && <span className="text-rose">✕</span>}
              {states[i] === 'idle' && <span className="text-dim">–</span>}
            </div>
          </div>
        ))}
      </div>

      {/* orchestrator */}
      <div className="mt-3 flex flex-col gap-2 rounded-lg border border-line bg-panel p-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="terminal-text text-[11px] text-dim">
          central orchestrator → normalized score
        </span>
        <span className="text-2xl font-extrabold text-indigo sm:text-xl">
          {finalScore !== null ? `${finalScore}/100` : running ? '…' : '—'}
        </span>
      </div>
      {finalScore !== null && states.includes('crashed') && (
        <p className="terminal-text mt-2 text-[11px] text-emerald">
          ✓ one core crashed, four answered — crash isolation kept the decision alive.
        </p>
      )}

      <button
        onClick={run}
        disabled={running}
        className="touch-target mt-3 w-full rounded-lg bg-indigo py-3 text-sm font-bold text-void transition-transform enabled:active:scale-[0.98] disabled:opacity-40 sm:py-2"
      >
        {running ? 'evaluating in parallel…' : 'evaluate a transaction'}
      </button>
      <p className="mt-2 text-[11px] text-dim">
        The real engine ran exactly this topology in Node.js for regulated core banking — 5 isolated
        processing cores, one orchestrator, no shared fate.
      </p>
    </div>
  );
}

function replace<T>(arr: T[], i: number, v: T): T[] {
  const next = [...arr];
  next[i] = v;
  return next;
}
