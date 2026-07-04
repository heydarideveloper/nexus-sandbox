import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { content } from '@/content';
import { useWorld } from '@/state/world';
import { sfx } from '@/audio/engine';

/** Engineering-note reader for hidden terminals. */
export function NoteOverlay() {
  const activeNote = useWorld((s) => s.activeNote);
  const closeNote = useWorld((s) => s.closeNote);
  const found = useWorld((s) => s.terminalsFound.length);
  const note = content.notes.find((n) => n.id === activeNote);

  return (
    <AnimatePresence>
      {note && (
        <Dialog.Root
          open
          onOpenChange={(open) => {
            if (!open) {
              sfx.close();
              closeNote();
            }
          }}
        >
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-40 bg-void/75 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                className="glass scanlines fixed top-1/2 left-1/2 z-50 w-[min(92vw,36rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border-t-2 border-t-gold p-6 sm:p-8"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
              >
                <p className="terminal-text text-[10px] tracking-[0.25em] text-gold uppercase">
                  engineering note · {note.kind} · terminal {found}/5
                </p>
                <Dialog.Title className="mt-2 text-xl font-extrabold text-ink">
                  {note.title}
                </Dialog.Title>
                <p className="terminal-text mt-4 text-sm leading-relaxed text-ink/85">
                  {note.body}
                </p>
                <div className="mt-6 flex justify-end">
                  <Dialog.Close asChild>
                    <button className="rounded-lg bg-gold px-4 py-2 text-sm font-bold text-void transition-transform hover:scale-105">
                      close
                    </button>
                  </Dialog.Close>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  );
}
