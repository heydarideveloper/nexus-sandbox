import { useState } from 'react';
import { motion } from 'framer-motion';

const SYMBOLS = ['◆', '★', '♠', '⬢', '☗'] as const;

interface RoundResult {
  reels: [number, number, number];
  win: boolean;
  payout: number;
  latencyMs: number;
}

/**
 * A miniature of the Jackpot architecture: the "server" (an async authority the UI cannot touch)
 * decides RNG and payouts; the client only renders what it is told — same principle, tiny scale.
 */
export function SlotsDemo() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<RoundResult | null>(null);
  const [balance, setBalance] = useState(100);
  const [log, setLog] = useState<string[]>(['> engine ready — authority: SERVER']);
  const [spinCount, setSpinCount] = useState(0);

  const spin = async () => {
    if (spinning || balance < 10) return;
    setSpinning(true);
    setBalance((b) => b - 10);
    const id = spinCount + 1;
    setSpinCount(id);
    push(`> SPIN #${id} → server (client renders, server decides)`);
    const round = await serverSpin();
    setResult(round);
    setBalance((b) => b + round.payout);
    push(
      round.win
        ? `< ROUND_RESULT #${id}: WIN +${round.payout} (server-verified, ${round.latencyMs}ms)`
        : `< ROUND_RESULT #${id}: no win (${round.latencyMs}ms)`,
    );
    setSpinning(false);
  };

  const push = (line: string) => setLog((l) => [...l.slice(-5), line]);

  return (
    <div className="rounded-xl border border-line bg-void/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="terminal-text text-[11px] text-amber uppercase">
          live demo — server-authoritative spin
        </span>
        <span className="terminal-text text-xs text-dim">
          balance: <span className="text-gold">{balance}</span>
        </span>
      </div>

      <div className="mb-3 flex justify-center gap-2">
        {[0, 1, 2].map((reel) => (
          <div
            key={reel}
            className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-line bg-panel text-3xl"
          >
            {spinning ? (
              <motion.div
                animate={{ y: [-40, 40] }}
                transition={{ duration: 0.15, repeat: Infinity, ease: 'linear' }}
                className="text-amber"
                aria-hidden
              >
                {SYMBOLS[(reel + spinCount) % SYMBOLS.length]}
              </motion.div>
            ) : (
              <span className={result?.win ? 'text-gold' : 'text-ink'}>
                {result ? SYMBOLS[result.reels[reel] ?? 0] : SYMBOLS[reel]}
              </span>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={spin}
        disabled={spinning || balance < 10}
        className="touch-target w-full rounded-lg bg-amber py-3 text-sm font-bold text-void transition-transform enabled:active:scale-[0.98] disabled:opacity-40 sm:py-2"
      >
        {balance < 10
          ? 'out of credits — refresh to reset'
          : spinning
            ? 'server deciding…'
            : 'SPIN (10 credits)'}
      </button>

      <div className="terminal-text mt-3 h-24 overflow-hidden rounded-lg border border-line bg-void p-2 text-[10px] leading-relaxed text-emerald">
        {log.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-dim">
        The client never computes an outcome — exactly how the real Jackpot engine prevents
        tampering. In production this round-trip is a custom binary WebSocket frame.
      </p>
    </div>
  );
}

/** Simulated authoritative backend: latency + RNG + payline check live "server-side". */
function serverSpin(): Promise<RoundResult> {
  const t0 = performance.now();
  return new Promise((resolve) => {
    setTimeout(
      () => {
        const reels: [number, number, number] = [rand(), rand(), rand()];
        const win = reels[0] === reels[1] && reels[1] === reels[2];
        const pair =
          !win && (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]);
        resolve({
          reels,
          win: win || pair,
          payout: win ? 100 : pair ? 15 : 0,
          latencyMs: Math.round(performance.now() - t0),
        });
      },
      220 + Math.random() * 260,
    );
  });
}

const rand = () => Math.floor(Math.random() * SYMBOLS.length);
