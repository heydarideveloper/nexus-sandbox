import { useEffect, useRef, useState } from 'react';
import { useQuality } from './quality';

/** Dev overlay — enable with `?perf=1` or in development. */
export function PerfOverlay() {
  const enabled =
    typeof window !== 'undefined' &&
    (import.meta.env.DEV || new URLSearchParams(window.location.search).has('perf'));
  const flags = useQuality((s) => s.flags);
  const profile = useQuality((s) => s.profile);
  const [fps, setFps] = useState(0);
  const [avgMs, setAvgMs] = useState(0);
  const [p95Ms, setP95Ms] = useState(0);
  const [heap, setHeap] = useState<number | null>(null);
  const samples = useRef<number[]>([]);
  const last = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    last.current = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const ms = now - last.current;
      last.current = now;
      samples.current.push(ms);
      if (samples.current.length > 120) samples.current.shift();
      const sorted = [...samples.current].sort((a, b) => a - b);
      const avg = sorted.reduce((a, b) => a + b, 0) / sorted.length;
      setAvgMs(avg);
      setP95Ms(sorted[Math.floor(sorted.length * 0.95)] ?? avg);
      setFps(Math.round(1000 / avg));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const id = window.setInterval(() => {
      const perf = performance as Performance & { memory?: { usedJSHeapSize: number } };
      if (perf.memory) setHeap(Math.round(perf.memory.usedJSHeapSize / 1048576));
    }, 1000);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(id);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      className="no-print pointer-events-none fixed z-[100] rounded-lg border border-line bg-void/90 p-2 font-mono text-[10px] text-dim backdrop-blur-sm"
      style={{
        top: 'max(0.5rem, env(safe-area-inset-top))',
        left: 'max(0.5rem, env(safe-area-inset-left))',
      }}
      aria-hidden
    >
      <div className="text-neon">
        {fps} fps · avg {avgMs.toFixed(1)}ms · p95 {p95Ms.toFixed(1)}ms
      </div>
      <div>
        tier {flags.tier} · {profile.screenClass} · {profile.gpuClass} gpu
        {profile.coarsePointer ? ' · touch' : ''}
      </div>
      {heap !== null && <div>heap {heap} MB</div>}
    </div>
  );
}
