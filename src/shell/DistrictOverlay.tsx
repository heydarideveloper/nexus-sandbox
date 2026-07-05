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
  const guidedFooter = useWorld((s) => s.mode === 'guided' && s.tourIndex >= 0);
  const district = content.districts.find((d) => d.id === activeDistrict);
  const Component = activeDistrict ? registry[activeDistrict] : undefined;

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
                className="glass fixed inset-x-0 bottom-0 top-[env(safe-area-inset-top,0px)] z-50 flex flex-col overflow-hidden rounded-t-2xl sm:inset-6 sm:rounded-2xl lg:inset-10"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ borderTop: `2px solid ${district.accent}` }}
              >
                <header className="flex shrink-0 items-start justify-between gap-3 border-b border-line px-4 py-3 sm:items-center sm:px-8">
                  <div className="min-w-0 flex-1">
                    <Dialog.Title className="text-base font-extrabold text-ink sm:text-xl">
                      {district.name}
                    </Dialog.Title>
                    <p className="terminal-text mt-0.5 line-clamp-2 text-[10px] text-dim sm:text-[11px]">
                      {district.tagline}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="hidden sm:block">
                      <TourAdvance />
                    </div>
                    <Dialog.Close asChild>
                      <button
                        className="touch-target flex h-11 w-11 items-center justify-center rounded-xl border border-line text-lg text-dim transition-colors active:border-rose active:text-rose sm:h-auto sm:w-auto sm:rounded-lg sm:px-3 sm:py-2 sm:text-sm"
                        aria-label={`Close ${district.name}`}
                      >
                        <span className="sm:hidden" aria-hidden>
                          ✕
                        </span>
                        <span className="hidden sm:inline">esc ✕</span>
                      </button>
                    </Dialog.Close>
                  </div>
                </header>

                <div className="district-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
                  <Suspense
                    fallback={
                      <div className="terminal-text flex h-40 items-center justify-center text-sm text-dim">
                        loading district...
                      </div>
                    }
                  >
                    <Component />
                  </Suspense>
                </div>

                {guidedFooter && (
                  <footer
                    className="shrink-0 border-t border-line bg-panel/90 px-4 py-3 sm:hidden"
                    style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
                  >
                    <TourAdvance mobileFooter />
                  </footer>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </>
  );
}
