import { Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useWorld } from '@/state/world';
import { Boot } from '@/shell/Boot';
import { ModeSelect } from '@/shell/ModeSelect';
import { Hud } from '@/shell/Hud';
import { Toasts } from '@/shell/Toasts';
import { DistrictOverlay } from '@/shell/DistrictOverlay';
import { ErrorBoundary } from '@/shell/ErrorBoundary';

/** The whole Three.js payload stays behind this boundary (performance budget: initial JS < 250 KB). */
const HubWorld = lazy(() => import('@/world/HubWorld'));
const ChatDrone = lazy(() => import('@/ai/ChatDrone'));

export default function App() {
  const phase = useWorld((s) => s.phase);
  const chatOpen = useWorld((s) => s.chatOpen);

  return (
    <main className="relative h-full overflow-hidden bg-void">
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
