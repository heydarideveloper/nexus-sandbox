import { Suspense, lazy, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useWorld } from '@/state/world';
import { useCoarsePointer, useQuality, useScreenClass } from '@/engine/quality';
import { PerfOverlay } from '@/engine/PerfOverlay';
import { Boot } from '@/shell/Boot';
import { ModeSelect } from '@/shell/ModeSelect';
import { Hud } from '@/shell/Hud';
import { Toasts } from '@/shell/Toasts';
import { DistrictOverlay } from '@/shell/DistrictOverlay';
import { ErrorBoundary } from '@/shell/ErrorBoundary';
import VirtualJoystick from '@/shell/VirtualJoystick';

const HubWorld = lazy(() => import('@/world/HubWorld'));
const ChatDrone = lazy(() => import('@/ai/ChatDrone'));

export default function App() {
  const phase = useWorld((s) => s.phase);
  const chatOpen = useWorld((s) => s.chatOpen);
  const activeDistrict = useWorld((s) => s.activeDistrict);
  const coarse = useCoarsePointer();
  const screenClass = useScreenClass();
  const init = useQuality((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  const showJoystick =
    phase === 'world' && (coarse || screenClass === 'phone') && !activeDistrict && !chatOpen;

  return (
    <main className="relative h-full overflow-hidden bg-void">
      <PerfOverlay />
      <AnimatePresence mode="wait">
        {phase === 'boot' && <Boot key="boot" />}
        {phase === 'mode' && <ModeSelect key="mode" />}
      </AnimatePresence>

      {phase === 'world' && (
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="terminal-text flex h-full items-center justify-center text-sm text-dim">
                &gt; rendering world<span className="cursor-blink">▮</span>
              </div>
            }
          >
            <HubWorld />
          </Suspense>
          <Hud />
          {showJoystick && <VirtualJoystick />}
          <DistrictOverlay />
          {chatOpen && (
            <Suspense fallback={null}>
              <ChatDrone />
            </Suspense>
          )}
        </ErrorBoundary>
      )}

      <Toasts />
    </main>
  );
}
