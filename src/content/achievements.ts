import type { Achievement } from './schema';

const CANONICAL = ['resume/resume.tex', 'resume/MOHAMMAD_HEYDARI_Full (1).pdf'];

/** Unlocks are tied to exploration; effects are environmental (spec: no static badges). */
export const achievements: Achievement[] = [
  {
    id: 'users-540k',
    title: '540K Users',
    description: 'Led React/Next.js architecture serving 540,000+ users at Portal.ir.',
    unlockedBy: 'career',
    worldEffect: 'The hub city lights up — tower windows switch on across the skyline.',
    sourceRefs: CANONICAL,
  },
  {
    id: 'ten-years',
    title: '10 Years Shipping',
    description: 'A decade of production software: 2015 junior PHP to senior full-stack lead.',
    unlockedBy: 'identity',
    worldEffect: 'The plaza beacon ignites and the ambient light warms.',
    sourceRefs: CANONICAL,
  },
  {
    id: 'frontend-lead',
    title: 'Frontend Lead ×3',
    description: 'Led frontend teams at Septa Pay, Pezeshket, and Portal.ir.',
    unlockedBy: 'career',
    worldEffect: 'Signal antennas extend from the career district towers.',
    sourceRefs: CANONICAL,
  },
  {
    id: 'healthcare-scale',
    title: 'Healthcare at Scale',
    description: '5,000+ doctors, 7,000+ concurrent sessions kept stable on Pezeshket.',
    unlockedBy: 'career',
    worldEffect: 'A clinical-white aurora crosses the sky.',
    sourceRefs: CANONICAL,
  },
  {
    id: 'server-authority',
    title: 'Server Authority',
    description:
      'Built a tamper-proof, server-authoritative game engine with a custom binary protocol.',
    unlockedBy: 'lab',
    worldEffect: 'Gold particle streams orbit the Innovation Lab.',
    sourceRefs: CANONICAL,
  },
  {
    id: 'crash-isolation',
    title: 'Crash Isolation',
    description:
      'Five isolated risk cores that fail alone, never together — regulated banking grade.',
    unlockedBy: 'factory',
    worldEffect: 'The factory pipelines shift to indigo and pulse in sync.',
    sourceRefs: CANONICAL,
  },
  {
    id: 'ai-native',
    title: 'AI Native',
    description:
      'Production LLM pipelines: structured outputs, grammar evaluation, fallback queues.',
    unlockedBy: 'observatory',
    worldEffect: 'The observatory satellites begin transmitting visible signals.',
    sourceRefs: CANONICAL,
  },
  {
    id: 'full-power',
    title: 'Full Power',
    description: 'Every district explored — the complete picture of the engineer.',
    unlockedBy: 'power-100',
    worldEffect: 'World power hits 100%: skyline transforms, particles surge, the music opens up.',
    sourceRefs: ['docs/PROFILE.md'],
  },
];
