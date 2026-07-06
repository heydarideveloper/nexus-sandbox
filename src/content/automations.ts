import type { Automation } from './schema';

const CANONICAL = ['resume/resume.tex', 'resume/MOHAMMAD_HEYDARI_Full (1).pdf'];

/**
 * Automation Center — real automated pipelines he designed and shipped
 * (no invented bots; spec Step 7 forbids fabricated content).
 */
export const automations: Automation[] = [
  {
    id: 'vokan-translation',
    name: 'Lazy Translation Pipeline',
    origin: 'VoKaN',
    description:
      'LLM-driven content generation for 13+ languages with local caching and fallback queues — translations materialize on demand and heal themselves when the API is unavailable.',
    stages: [
      'Detect missing locale',
      'Check local cache',
      'gpt-4o-mini structured request',
      'Validate JSON',
      'Persist + serve',
      'Fallback queue on failure',
    ],
    cadence: 'On demand, self-healing',
    sourceRefs: CANONICAL,
  },
  {
    id: 'fsrs-scheduler',
    name: 'FSRS Review Scheduler',
    origin: 'VoKaN',
    description:
      'Spaced-repetition engine computing card stability, difficulty, and next-review timing inside expo-sqlite — fully offline, per-user, mathematical.',
    stages: [
      'Review event',
      'Update stability & difficulty',
      'Compute next interval',
      'Write schedule to SQLite',
    ],
    cadence: 'Every review interaction',
    sourceRefs: CANONICAL,
  },
  {
    id: 'jackpot-loadtest',
    name: 'WebSocket Load Harness',
    origin: 'Jackpot',
    description:
      'Custom script simulating 10,000 concurrent WebSocket connections to verify engine stability and message latency before releases.',
    stages: [
      'Spawn 10K virtual clients',
      'Binary handshake',
      'Spin traffic pattern',
      'Collect latency percentiles',
      'Report',
    ],
    cadence: 'Pre-release',
    sourceRefs: CANONICAL,
  },
  {
    id: 'portal-lifecycle',
    name: 'Site Lifecycle Automation',
    origin: 'Portal.ir',
    description:
      'Automated multi-tenant site creation, dynamic app configuration, and lifecycle management for 10,000+ active websites.',
    stages: [
      'Tenant request',
      'Provision site',
      'Apply dynamic app config',
      'Publish',
      'Monitor lifecycle events',
    ],
    cadence: 'Continuous, production',
    sourceRefs: CANONICAL,
  },
  {
    id: 'nexus-ci',
    name: 'Nexus Quality Pipeline',
    origin: 'This site',
    description:
      'The pipeline keeping this world honest: lint, format, typecheck, unit tests, e2e, dependency audit, and RAG index build on every push.',
    stages: [
      'Lint + format',
      'Typecheck',
      'Unit tests',
      'Build',
      'E2E (Playwright)',
      'npm audit',
      'Deploy',
    ],
    cadence: 'Every push',
    sourceRefs: ['docs/PROFILE.md'],
  },
];
