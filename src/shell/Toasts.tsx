import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWorld } from '@/state/world';
import { sfx } from '@/audio/engine';

const ICONS = { achievement: '🏆', terminal: '🖥', info: 'ℹ️' } as const;

export function Toasts() {
  const toasts = useWorld((s) => s.toasts);
  const dismiss = useWorld((s) => s.dismissToast);

  useEffect(() => {
    if (toasts.length === 0) return;
    const latest = toasts[toasts.length - 1];
    if (latest?.kind === 'achievement') sfx.unlock();
    if (latest?.kind === 'terminal') sfx.terminal();
    const t = setTimeout(() => latest && dismiss(latest.id), 5200);
    return () => clearTimeout(t);
  }, [toasts, dismiss]);

  return (
    <div
      className="no-print pointer-events-none absolute right-3 bottom-20 z-40 flex w-[min(88vw,20rem)] flex-col gap-2"
      role="log"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="glass pointer-events-auto rounded-xl p-3 text-left"
            onClick={() => dismiss(t.id)}
          >
            <div className="flex items-center gap-2">
              <span aria-hidden>{ICONS[t.kind]}</span>
              <span className="text-sm font-bold text-ink">{t.title}</span>
            </div>
            <p className="mt-1 text-xs text-dim">{t.body}</p>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
