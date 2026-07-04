import type { Experiment } from './schema';

const CANONICAL = ['resume/resume.tex', 'resume/MOHAMMAD_HEYDARI_Full (1).pdf'];
const PROFILE = ['docs/PROFILE.md'];

/** AI Research Lab — engineering experiments with the spec's problem/hypothesis/result structure. */
export const experiments: Experiment[] = [
  {
    id: 'structured-outputs',
    title: 'LLMs as Dependable Components',
    area: 'Structured Outputs',
    problem: 'Raw LLM text breaks UIs: malformed lists, drifting formats, hallucinated fields.',
    hypothesis:
      'Constraining gpt-4o-mini to JSON-schema structured outputs and validating at the boundary makes the model a reliable microservice.',
    implementation:
      'VoKaN content pipeline: schema-constrained requests, boundary validation, local caching, fallback queues for outages, lazy generation per language.',
    results:
      'Shipped in production across 13+ languages; UI never renders unvalidated model output.',
    future: 'Batch pre-generation with quality scoring; per-language prompt tuning.',
    status: 'shipped',
    sourceRefs: CANONICAL,
  },
  {
    id: 'llm-grammar',
    title: 'LLM Grammar Evaluation',
    area: 'AI Assessment',
    problem: 'Learners need grammar feedback that rule engines cannot cover across 13+ languages.',
    hypothesis:
      'An LLM with structured evaluation prompts can grade free-form answers consistently enough for a learning loop.',
    implementation:
      'LLM-based grammar evaluation feature in VoKaN wired into the interactive review flow.',
    results: 'Live in the shipped product alongside drag-and-drop morpheme puzzles.',
    future: 'Calibration set to measure grading consistency; confidence-based deferral.',
    status: 'shipped',
    sourceRefs: CANONICAL,
  },
  {
    id: 'fsrs-model',
    title: 'FSRS On-Device Scheduling',
    area: 'Learning Science',
    problem: 'Cloud-scheduled reviews die offline; naive intervals (SM-2) waste reviews.',
    hypothesis:
      'The FSRS mathematical model can run entirely in expo-sqlite, computing stability and difficulty per card with zero server dependency.',
    implementation:
      'FSRS state machine embedded in the local database; review events update stability, difficulty, and schedule in one transaction.',
    results: 'Offline-first spaced repetition shipped on iOS, Android, and Web.',
    future: 'Parameter fitting from real review history.',
    status: 'shipped',
    sourceRefs: CANONICAL,
  },
  {
    id: 'binary-protocol',
    title: 'Binary WebSocket Codec',
    area: 'Real-Time Protocols',
    problem:
      'JSON over WebSocket was too heavy and too loose for server-authoritative game rounds.',
    hypothesis:
      'A custom binary protocol with one codec shared by client and server gives lower latency and makes protocol drift impossible.',
    implementation:
      'Shared client/server codec in Jackpot: compact frames, GET_ROUND_RESULT state recovery, lightweight heartbeats; verified under 10K simulated connections.',
    results:
      'Low-latency rounds with mid-round reconnection; single source of truth for the wire format.',
    future: 'Protocol versioning and replay tooling.',
    status: 'shipped',
    sourceRefs: CANONICAL,
  },
  {
    id: 'rag-twin',
    title: 'RAG Digital Twin',
    area: 'Retrieval-Augmented Generation',
    problem: 'A portfolio assistant that hallucinates achievements is worse than no assistant.',
    hypothesis:
      'Grounding every answer in retrieved chunks of the living content model — with refusal when evidence is missing — produces a trustworthy twin.',
    implementation:
      'This site: deterministic chunking, local BM25 retrieval, optional embedding index, edge LLM generation with persona guardrails and citations.',
    results: 'In progress — evaluated against a golden question set including must-refuse cases.',
    future: 'Re-ranking, conversation memory, personal MCP server over the content model.',
    status: 'in-progress',
    sourceRefs: PROFILE,
  },
  {
    id: 'world-perf',
    title: '3D World on a Performance Budget',
    area: 'Rendering',
    problem:
      'Immersive WebGL portfolios are routinely beautiful and unusable: 10 MB bundles, dead phones.',
    hypothesis:
      'Instancing, lazy-loaded district scenes, capped draw calls, and DOM-first content can deliver the experience inside Core Web Vitals budgets.',
    implementation:
      'Nexus Sandbox: initial JS < 250 KB with Three.js code-split, instanced skyline, adaptive quality, full HTML fallback route.',
    results: 'In progress — budgets enforced in CI, measured in the performance report.',
    future: 'Texture compression pipeline (gltfpack/gltf-transform) when 3D assets are introduced.',
    status: 'in-progress',
    sourceRefs: PROFILE,
  },
];
