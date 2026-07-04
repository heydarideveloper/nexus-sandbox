import type { District } from './schema';

/**
 * World topology. Positions are portal coordinates (x, z) on the hub plaza,
 * arranged as a ring around the identity spawn at the center.
 */
export const districts: District[] = [
  {
    id: 'identity',
    name: 'Identity Plaza',
    tagline: 'Who is connected to you right now',
    position: [0, 0],
    accent: '#22d3ee',
    guidedSeconds: 45,
  },
  {
    id: 'brain',
    name: 'The Brain',
    tagline: 'A living knowledge graph — every node is evidence',
    position: [-16, -10],
    accent: '#c084fc',
    guidedSeconds: 60,
  },
  {
    id: 'career',
    name: 'Career Line',
    tagline: 'Ten years as a transit map — board the train',
    position: [16, -10],
    accent: '#3b82f6',
    guidedSeconds: 75,
  },
  {
    id: 'lab',
    name: 'Innovation Lab',
    tagline: 'Projects as living prototypes on workbenches',
    position: [-20, 4],
    accent: '#f59e0b',
    guidedSeconds: 75,
  },
  {
    id: 'factory',
    name: 'System Design Factory',
    tagline: 'Watch his architectures actually run',
    position: [20, 4],
    accent: '#818cf8',
    guidedSeconds: 60,
  },
  {
    id: 'observatory',
    name: 'Learning Observatory',
    tagline: 'Honest progress bars — what he is learning right now',
    position: [-12, 16],
    accent: '#34d399',
    guidedSeconds: 45,
  },
  {
    id: 'automation',
    name: 'Automation Center',
    tagline: 'Pipelines he built, running before your eyes',
    position: [12, 16],
    accent: '#fb7185',
    guidedSeconds: 45,
  },
  {
    id: 'mission',
    name: 'Mission Control',
    tagline: 'Generate a resume, start a conversation, hire him',
    position: [0, 22],
    accent: '#facc15',
    guidedSeconds: 60,
  },
];
