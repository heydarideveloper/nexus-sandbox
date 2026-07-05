import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useQuality } from './quality';

/** Rolling frame-time governor — degrades/recovers quality tiers based on budget. */
export function FrameGovernor() {
  const frameBudgetMs = useQuality((s) => s.flags.frameBudgetMs);
  const degradeRuntime = useQuality((s) => s.degradeRuntime);
  const recoverRuntime = useQuality((s) => s.recoverRuntime);
  const hubPaused = useQuality((s) => s.hubPaused);

  const samples = useRef<number[]>([]);
  const badStreak = useRef(0);
  const goodStreak = useRef(0);

  useFrame((_, delta) => {
    if (hubPaused) return;
    const ms = delta * 1000;
    samples.current.push(ms);
    if (samples.current.length > 60) samples.current.shift();
    const avg = samples.current.reduce((a, b) => a + b, 0) / samples.current.length;

    if (avg > frameBudgetMs * 1.15) {
      badStreak.current += 1;
      goodStreak.current = 0;
      if (badStreak.current >= 45) {
        degradeRuntime();
        badStreak.current = 0;
        samples.current = [];
      }
    } else if (avg < frameBudgetMs * 0.85) {
      goodStreak.current += 1;
      badStreak.current = 0;
      if (goodStreak.current >= 180) {
        recoverRuntime();
        goodStreak.current = 0;
      }
    }
  });

  return null;
}
