import { Suspense, lazy, useEffect, type ComponentType, type LazyExoticComponent } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { content } from '@/content';
import { useWorld } from '@/state/world';
import { sfx } from '@/audio/engine';
import { TourAdvance } from './Hud';

const registry: Record<string, LazyExoticComponent<ComponentType>> = {
  identity: lazy(() => import('@/world/districts/Identity')),
  brain: lazy(() => import('@/world/districts/Brain')),
  career: lazy(() => import('@/world/districts/Career')),
  lab: lazy(() => import('@/world/districts/Lab')),
  factory: lazy(() => import('@/world/districts/Factory')),
  observatory: lazy(() => import('@/world/districts/Observatory')),
  automation: lazy(() => import('@/world/districts/Automation')),
  mission: lazy(() => import('@/world/districts/Mission')),
};

export function DistrictOverlay() {
  const activeDistrict = useWorld((s) => s.activeDistrict);
  const closeDistrict = useWorld((s) => s.closeDistrict);
  const district = content.districts.find((d) => d.id === activeDistrict);
  const Component = activeDistrict ? registry[activeDistrict] : undefined;

  // Belt-and-braces escape handling: guarantee close even if focus sits outside the Radix layer.
  useEffect(() => {
    if (!activeDistrict) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sfx.close();
        closeDistrict();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeDistrict, closeDistrict]);

  // No exit animation on purpose: closing must be instant even when the main thread is
  // busy with WebGL work — determinism beats a 200 ms fade (principle #1).
  return (
    <>
      {district && Component && (
        <Dialog.Root
          open
          onOpenChange={(open) => {
            if (!open) {
              sfx.close();
              closeDistrict();
            }
          }}
        >
          <Dialog.Portal>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-40 bg-void/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            </Dialog.Overlay>
            <Dialog.Content
              asChild
              onOpenAutoFocus={(e) => e.preventDefault()}
              aria-describedby={undefined}
            >
              <motion.div
                className="glass fixed inset-3 z-50 flex flex-col overflow-hidden rounded-2xl sm:inset-6 lg:inset-10"
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ borderTop: `2px solid ${district.accent}` }}
              >
                <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 sm:px-8">
                  <div>
                    <Dialog.Title className="text-lg font-extrabold text-ink sm:text-xl">
                      {district.name}
                    </Dialog.Title>
                    <p className="terminal-text text-[11px] text-dim">{district.tagline}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <TourAdvance />
                    <Dialog.Close asChild>
                      <button
                        className="rounded-lg border border-line px-3 py-1.5 text-sm text-dim transition-colors hover:border-rose hover:text-rose"
                        aria-label={`Close ${district.name}`}
                      >
                        esc ✕
                      </button>
                    </Dialog.Close>
                  </div>
                </header>
                <div className="district-scroll flex-1 overflow-y-auto">
                  <Suspense
                    fallback={
                      <div className="terminal-text flex h-full items-center justify-center text-sm text-dim">
                        loading district...
                      </div>
                    }
                  >
                    <Component />
                  </Suspense>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </>
  );
}
