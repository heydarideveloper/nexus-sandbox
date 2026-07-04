import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { content } from '@/content';

export type Phase = 'boot' | 'mode' | 'world';
export type Mode = 'guided' | 'explorer';

export interface Toast {
  id: string;
  title: string;
  body: string;
  kind: 'achievement' | 'terminal' | 'info';
}

interface WorldState {
  phase: Phase;
  mode: Mode | null;
  /** District overlay currently open (null = roaming the hub). */
  activeDistrict: string | null;
  visited: string[];
  unlockedAchievements: string[];
  terminalsFound: string[];
  /** Guided tour stop index (-1 = not touring). */
  tourIndex: number;
  audioOn: boolean;
  chatOpen: boolean;
  toasts: Toast[];
  /** Target the drone should fly to (portal position), set by tour or quick-travel. */
  flyTarget: [number, number] | null;
  /** Engineering note currently open (hidden terminal content). */
  activeNote: string | null;

  finishBoot: () => void;
  chooseMode: (mode: Mode) => void;
  openDistrict: (id: string) => void;
  closeDistrict: () => void;
  advanceTour: () => void;
  exitTour: () => void;
  findTerminal: (id: string) => void;
  openNote: (id: string) => void;
  closeNote: () => void;
  toggleAudio: () => void;
  setChatOpen: (open: boolean) => void;
  dismissToast: (id: string) => void;
  setFlyTarget: (target: [number, number] | null) => void;
  resetProgress: () => void;
}

const DISTRICT_COUNT = content.districts.length;

export const powerOf = (visited: string[]): number =>
  Math.round((Math.min(visited.length, DISTRICT_COUNT) / DISTRICT_COUNT) * 100);

/** Tour order: identity first, mission control last, ring in between. */
export const TOUR_ORDER = [
  'identity',
  'brain',
  'career',
  'lab',
  'factory',
  'observatory',
  'automation',
  'mission',
] as const;

function achievementToasts(
  visited: string[],
  districtId: string,
  alreadyUnlocked: string[],
): { unlocked: string[]; toasts: Toast[] } {
  const unlocked: string[] = [];
  const toasts: Toast[] = [];
  const fullPower = powerOf(visited) >= 100;
  for (const a of content.achievements) {
    if (alreadyUnlocked.includes(a.id) || unlocked.includes(a.id)) continue;
    const hit = a.unlockedBy === districtId || (a.unlockedBy === 'power-100' && fullPower);
    if (hit) {
      unlocked.push(a.id);
      toasts.push({
        id: `ach-${a.id}-${Date.now()}`,
        title: `Unlocked — ${a.title}`,
        body: a.worldEffect,
        kind: 'achievement',
      });
    }
  }
  return { unlocked, toasts };
}

export const useWorld = create<WorldState>()(
  persist(
    (set, get) => ({
      phase: 'boot',
      mode: null,
      activeDistrict: null,
      visited: [],
      unlockedAchievements: [],
      terminalsFound: [],
      tourIndex: -1,
      audioOn: false,
      chatOpen: false,
      toasts: [],
      flyTarget: null,
      activeNote: null,

      finishBoot: () => set({ phase: 'mode' }),

      chooseMode: (mode) =>
        set({
          phase: 'world',
          mode,
          tourIndex: mode === 'guided' ? 0 : -1,
          flyTarget: mode === 'guided' ? findPortal(TOUR_ORDER[0]) : null,
        }),

      openDistrict: (id) => {
        const { visited, unlockedAchievements, toasts } = get();
        const nextVisited = visited.includes(id) ? visited : [...visited, id];
        const { unlocked, toasts: newToasts } = achievementToasts(
          nextVisited,
          id,
          unlockedAchievements,
        );
        set({
          activeDistrict: id,
          visited: nextVisited,
          unlockedAchievements: [...unlockedAchievements, ...unlocked],
          toasts: [...toasts, ...newToasts].slice(-4),
          flyTarget: null,
        });
      },

      closeDistrict: () => set({ activeDistrict: null }),

      advanceTour: () => {
        const { tourIndex } = get();
        const next = tourIndex + 1;
        if (next >= TOUR_ORDER.length) {
          set({ tourIndex: -1, mode: 'explorer', activeDistrict: null });
          return;
        }
        set({
          tourIndex: next,
          activeDistrict: null,
          flyTarget: findPortal(TOUR_ORDER[next] ?? 'identity'),
        });
      },

      exitTour: () => set({ tourIndex: -1, mode: 'explorer', flyTarget: null }),

      findTerminal: (id) => {
        const { terminalsFound, toasts } = get();
        if (terminalsFound.includes(id)) return;
        const found = [...terminalsFound, id];
        const note = content.notes.find((n) => n.id === id);
        set({
          terminalsFound: found,
          toasts: [
            ...toasts,
            {
              id: `term-${id}-${Date.now()}`,
              title: `Hidden terminal ${found.length}/5`,
              body: note
                ? `Engineering note recovered: "${note.title}"`
                : 'Engineering note recovered.',
              kind: 'terminal' as const,
            },
          ].slice(-4),
        });
      },

      openNote: (id) => set({ activeNote: id }),
      closeNote: () => set({ activeNote: null }),

      toggleAudio: () => set((s) => ({ audioOn: !s.audioOn })),
      setChatOpen: (open) => set({ chatOpen: open }),
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
      setFlyTarget: (target) => set({ flyTarget: target }),

      resetProgress: () =>
        set({
          visited: [],
          unlockedAchievements: [],
          terminalsFound: [],
          tourIndex: -1,
          activeDistrict: null,
          phase: 'boot',
          mode: null,
        }),
    }),
    {
      name: 'nexus-world',
      partialize: (s) => ({
        visited: s.visited,
        unlockedAchievements: s.unlockedAchievements,
        terminalsFound: s.terminalsFound,
      }),
    },
  ),
);

function findPortal(id: string): [number, number] {
  const d = content.districts.find((x) => x.id === id);
  return d ? d.position : [0, 0];
}

export const useWorldPower = (): number => useWorld((s) => powerOf(s.visited));
