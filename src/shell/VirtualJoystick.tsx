import { useCallback, useRef } from 'react';
import { setJoystickInput } from '@/engine/input';

const MAX = 48;

/** Virtual joystick — left thumb zone, coarse-pointer devices only. */
export default function VirtualJoystick() {
  const base = useRef<{ x: number; y: number } | null>(null);
  const active = useRef(false);

  const end = useCallback(() => {
    active.current = false;
    base.current = null;
    setJoystickInput(0, 0);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    base.current = { x: e.clientX, y: e.clientY };
    active.current = true;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!active.current || !base.current) return;
    const dx = e.clientX - base.current.x;
    const dy = e.clientY - base.current.y;
    const len = Math.hypot(dx, dy) || 1;
    const scale = Math.min(len, MAX) / len;
    // Screen Y down = forward in world -Z
    setJoystickInput((dx / MAX) * scale, (dy / MAX) * scale);
  };

  return (
    <div
      className="pointer-events-auto fixed z-30 touch-none select-none"
      style={{
        left: 'max(1rem, env(safe-area-inset-left))',
        bottom: 'calc(7.25rem + env(safe-area-inset-bottom))',
        width: 112,
        height: 112,
      }}
      data-testid="virtual-joystick"
      aria-label="Movement joystick"
      role="application"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={end}
      onPointerCancel={end}
    >
      <div className="relative h-full w-full rounded-full border border-line/80 bg-panel/40 backdrop-blur-sm">
        <div
          className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neon/50 bg-neon/20"
          aria-hidden
        />
      </div>
    </div>
  );
}
