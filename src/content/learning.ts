import type { LearningItem } from './schema';

const PROFILE = ['docs/PROFILE.md'];

/**
 * Learning Observatory — honest, current learning tracks. Progress values are self-assessed
 * and deliberately conservative (docs/PROFILE.md §14: gaps rendered as learning, never claims).
 */
export const learning: LearningItem[] = [
  {
    id: 'threejs',
    label: 'Three.js / React Three Fiber',
    progress: 45,
    why: 'Interactive 3D is where frontend engineering, product storytelling, and performance work converge — and it was the biggest gap in an otherwise deep frontend profile.',
    resources: [
      'Three.js Journey coursework',
      'React Three Fiber + drei documentation and pmndrs examples',
      'The Book of Shaders (GLSL fundamentals)',
    ],
    experiments: [
      'Nexus Sandbox itself: hub world, particle systems, instanced meshes, camera choreography',
      'Draw-call and frame-time budgeting against a 16 ms GPU target',
    ],
    futureIdeas: [
      'Custom shader materials for the district skylines',
      'WebGPU/TSL migration when stable',
    ],
    sourceRefs: PROFILE,
  },
  {
    id: 'rag',
    label: 'RAG & Embeddings',
    progress: 40,
    why: 'Production LLM work at VoKaN proved integration skills; retrieval is the next layer — grounding answers in real evidence instead of model memory.',
    resources: [
      'OpenAI embeddings + retrieval documentation',
      'BM25 and hybrid retrieval literature',
      'Evaluation methods: retrieval hit-rate, hallucination testing',
    ],
    experiments: [
      '"Talk with Mohammad": deterministic chunking of the content model, local BM25 retrieval, optional embedding index, persona guardrails',
      'Golden-question evaluation set with refusal checks for unanswerable questions',
    ],
    futureIdeas: ['Re-ranking layer', 'Conversation memory with citation persistence'],
    sourceRefs: PROFILE,
  },
  {
    id: 'agents',
    label: 'AI Agents & MCP',
    progress: 30,
    why: 'Agent-assisted delivery is already part of the daily workflow; understanding agent architectures and the Model Context Protocol from the inside is the difference between using and engineering them.',
    resources: [
      'Model Context Protocol specification',
      'Function calling / tool-use patterns in production systems',
    ],
    experiments: ['Agent-assisted build pipeline for this project (documented in docs/adr/)'],
    futureIdeas: ['A personal MCP server exposing the living content model to any AI client'],
    sourceRefs: PROFILE,
  },
  {
    id: 'vectordb',
    label: 'Vector Databases',
    progress: 30,
    why: 'The storage half of RAG: knowing when a static index is enough (it is, for this site) and when pgvector or a dedicated store earns its complexity.',
    resources: ['pgvector documentation', 'HNSW / ANN index papers and benchmarks'],
    experiments: [
      'Static embedding index build script (scripts/build-index.mjs) with graceful lexical fallback',
    ],
    futureIdeas: ['pgvector-backed memory when the knowledge base outgrows ~1k chunks'],
    sourceRefs: PROFILE,
  },
  {
    id: 'distributed',
    label: 'Distributed Systems (deeper)',
    progress: 50,
    why: 'Jackpot Redis locking and Portal scale pushed applied distributed systems; the goal is first-principles depth — consensus, partitioning, and failure models.',
    resources: ['Designing Data-Intensive Applications', 'Jepsen analyses'],
    experiments: [
      'Distributed locking and SSR/ISR caching patterns from production work, re-examined against the literature',
    ],
    futureIdeas: ['Event-sourced variant of the Jackpot wallet ledger'],
    sourceRefs: PROFILE,
  },
];
