import { content } from '@/content';
import { useWorld } from '@/state/world';
import { sfx } from '@/audio/engine';

/** Compact labels for the phone grid — full names stay in `title` + aria-label. */
const SHORT: Record<string, string> = {
  identity: 'Plaza',
  brain: 'Brain',
  career: 'Career',
  lab: 'Lab',
  factory: 'Factory',
  observatory: 'Learn',
  automation: 'Auto',
  mission: 'Mission',
};

export function QuickTravelDock() {
  const visited = useWorld((s) => s.visited);
  const activeDistrict = useWorld((s) => s.activeDistrict);
  const openDistrict = useWorld((s) => s.openDistrict);
  const setFlyTarget = useWorld((s) => s.setFlyTarget);

  if (activeDistrict) return null;

  return (
    <nav
      className="no-print pointer-events-auto absolute inset-x-0 bottom-0 z-30 safe-x"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      aria-label="District quick travel"
    >
      {/* Phone: 4×2 grid with short labels */}
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1.5 p-2 glass rounded-2xl sm:hidden">
        {content.districts.map((d) => (
          <button
            key={d.id}
            onClick={() => {
              setFlyTarget(d.position);
              openDistrict(d.id);
              sfx.open();
            }}
            title={d.name}
            aria-label={`Travel to ${d.name}`}
            className={`terminal-text touch-target flex min-h-[44px] flex-col items-center justify-center rounded-xl px-1 py-2 text-[10px] leading-tight transition-colors ${
              visited.includes(d.id) ? 'text-ink' : 'text-dim'
            } active:bg-line/60`}
            style={{
              boxShadow: visited.includes(d.id) ? `inset 0 -2px 0 ${d.accent}` : undefined,
            }}
          >
            <span className="font-semibold">{SHORT[d.id] ?? d.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Tablet / desktop: horizontal strip */}
      <div className="mx-auto hidden max-w-[96vw] gap-1 overflow-x-auto rounded-2xl p-1.5 glass scrollbar-none sm:flex">
        {content.districts.map((d) => (
          <button
            key={d.id}
            onClick={() => {
              setFlyTarget(d.position);
              openDistrict(d.id);
              sfx.open();
            }}
            onMouseEnter={() => sfx.hover()}
            title={d.tagline}
            aria-label={`Travel to ${d.name}`}
            className={`terminal-text touch-target shrink-0 rounded-xl px-3 py-2 text-[11px] whitespace-nowrap transition-colors ${
              visited.includes(d.id) ? 'text-ink' : 'text-dim'
            } hover:bg-line/60`}
            style={{
              boxShadow: visited.includes(d.id) ? `inset 0 -2px 0 ${d.accent}` : undefined,
            }}
          >
            {d.name}
          </button>
        ))}
      </div>
    </nav>
  );
}
