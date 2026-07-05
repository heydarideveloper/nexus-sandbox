import { useState } from 'react';
import { motion } from 'framer-motion';

interface CardState {
  stability: number;
  difficulty: number;
  reviews: number;
  intervalDays: number;
}

const INITIAL: CardState = { stability: 1, difficulty: 5, reviews: 0, intervalDays: 1 };

/**
 * FSRS in miniature — the same idea VoKaN runs inside expo-sqlite: each grade updates
 * stability & difficulty, which produce the next review interval. Simplified curves, real shape.
 */
export function FsrsDemo() {
  const [card, setCard] = useState<CardState>(INITIAL);
  const [history, setHistory] = useState<number[]>([]);

  const review = (grade: 'again' | 'good' | 'easy') => {
    setCard((c) => {
      const difficulty = clamp(
        c.difficulty + (grade === 'again' ? 0.8 : grade === 'easy' ? -0.6 : -0.1),
        1,
        10,
      );
      const stability =
        grade === 'again'
          ? Math.max(1, c.stability * 0.4)
          : c.stability * (grade === 'easy' ? 2.4 : 1.7) * (1 - (difficulty - 5) * 0.05);
      const intervalDays = Math.max(1, Math.round(stability * 0.9));
      const next = { stability, difficulty, reviews: c.reviews + 1, intervalDays };
      setHistory((h) => [...h.slice(-11), intervalDays]);
      return next;
    });
  };

  const retention = (day: number) => Math.exp((-day / Math.max(card.stability, 0.1)) * 0.35);

  return (
    <div className="rounded-xl border border-line bg-void/60 p-4">
      <span className="terminal-text text-[11px] text-emerald uppercase">
        live demo — fsrs review scheduling
      </span>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        {[
          ['stability', card.stability.toFixed(1)],
          ['difficulty', card.difficulty.toFixed(1)],
          ['next review', `${card.intervalDays}d`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-line bg-panel p-2">
            <div className="terminal-text text-[9px] text-dim uppercase">{label}</div>
            <div className="text-lg font-bold text-emerald">{value}</div>
          </div>
        ))}
      </div>

      {/* forgetting curve */}
      <div className="mt-3 rounded-lg border border-line bg-panel p-3">
        <div className="terminal-text mb-1 text-[9px] text-dim uppercase">
          predicted retention over 30 days
        </div>
        <svg viewBox="0 0 300 60" className="w-full" role="img" aria-label="Forgetting curve">
          <polyline
            fill="none"
            stroke="#34d399"
            strokeWidth="2"
            points={Array.from(
              { length: 31 },
              (_, d) => `${d * 10},${58 - retention(d) * 54}`,
            ).join(' ')}
          />
          <line x1="0" y1="58" x2="300" y2="58" stroke="#1c2438" />
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {(
          [
            ['again', 'bg-rose', 'forgot it'],
            ['good', 'bg-emerald', 'recalled it'],
            ['easy', 'bg-neon', 'trivial'],
          ] as const
        ).map(([grade, cls, hint]) => (
          <button
            key={grade}
            onClick={() => review(grade)}
            className={`${cls} touch-target rounded-lg py-3 text-xs font-bold text-void transition-transform active:scale-[0.98] sm:py-2`}
            title={hint}
          >
            {grade.toUpperCase()}
          </button>
        ))}
      </div>

      {history.length > 0 && (
        <div className="mt-3 flex items-end gap-1" aria-label="Interval growth per review">
          {history.map((d, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: Math.min(56, 6 + d * 1.4) }}
              className="w-4 rounded-t bg-emerald/60"
              title={`${d} days`}
            />
          ))}
          <span className="terminal-text ml-2 text-[10px] text-dim">interval growth →</span>
        </div>
      )}

      <p className="mt-2 text-[11px] text-dim">
        Grade the card and watch stability compound — VoKaN runs the full FSRS model per card, per
        language, offline in SQLite.
      </p>
    </div>
  );
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
