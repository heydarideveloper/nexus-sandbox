import type { Project } from './schema';

const CANONICAL = ['resume/resume.tex', 'resume/MOHAMMAD_HEYDARI_Full (1).pdf'];

/** Innovation Lab workbenches. */
export const projects: Project[] = [
  {
    id: 'jackpot',
    name: 'Jackpot',
    kind: 'platform',
    period: '2026 – Present',
    role: 'Sole engineer — backend, protocol, frontend',
    summary:
      'A server-authoritative slot game platform where the client renders and the server decides. NestJS owns RNG, paylines, and wallets; a custom binary WebSocket codec keeps latency low; Redis locks kill race conditions.',
    problems: [
      'Client-side tampering must be impossible, not just difficult.',
      'Concurrent spins race on shared wallet state.',
      'Real-time feel despite full server authority.',
    ],
    solutions: [
      'All game math server-side in NestJS: RNG generation, payline checks, wallet mutations.',
      'Custom binary WebSocket protocol with shared client/server codec — low-latency messages, GET_ROUND_RESULT recovery, lightweight heartbeats.',
      'Redis distributed spin-locking around wallet mutations; TypeORM over PostgreSQL/SQLite for consistency.',
      'React 19 + Vite + Zustand frontend animating purely from server event streams.',
    ],
    architecture: [
      'Client (React 19 + Zustand) → binary WS codec → NestJS engine → Redis locks → PostgreSQL',
      'Load verified by a custom script simulating 10,000 concurrent WebSocket connections.',
    ],
    tech: ['NestJS', 'React 19', 'Vite', 'Zustand', 'WebSockets', 'TypeORM', 'PostgreSQL', 'Redis'],
    metrics: [
      { label: 'Load test', value: '10,000 concurrent WS connections' },
      { label: 'Authority', value: '100% server-side' },
    ],
    lessons: [
      'Binary protocols pay off only when you own both ends — the shared codec made evolution safe.',
      'State recovery (rejoin mid-round) has to be designed into the protocol, not bolted on.',
    ],
    liveUrl: 'https://frontend-ten-indol-10.vercel.app/',
    demo: 'slots',
    sourceRefs: CANONICAL,
  },
  {
    id: 'vokan',
    name: 'VoKaN',
    kind: 'product',
    period: '2026 – Present',
    role: 'Sole engineer — product, mobile, AI pipeline',
    summary:
      'An AI-powered vocabulary product on iOS, Android, and Web from one Expo 56 codebase. gpt-4o-mini generates content through structured JSON outputs; FSRS schedules reviews inside a local SQLite database; the whole thing works offline.',
    problems: [
      'One codebase, three platforms, native feel on each.',
      'LLM output is untrusted input — the UI must never break on it.',
      'Browsers block SQLite WASM without cross-origin isolation.',
    ],
    solutions: [
      'Expo 56 New Architecture with Reanimated + Gesture Handler for drag-and-drop morpheme puzzles.',
      'Structured JSON outputs validated at the boundary; local caching, fallback queues, and lazy translation pipelines across 13+ languages.',
      'FSRS mathematical model in expo-sqlite computing card stability, difficulty, and review schedules.',
      'COOP/COEP headers fixed via custom Metro proxy scripts to unlock SQLite WASM on web.',
    ],
    architecture: [
      'Expo app → OpenAI structured outputs → validation → local SQLite (FSRS state) → review UI',
      'Offline-first: cache → fallback queue → lazy translation when connectivity returns.',
    ],
    tech: [
      'React Native',
      'Expo 56',
      'OpenAI API',
      'SQLite WASM',
      'FSRS',
      'Reanimated',
      'TypeScript',
    ],
    metrics: [
      { label: 'Languages', value: '13+' },
      { label: 'Platforms', value: '3 from one codebase' },
    ],
    lessons: [
      'Treat the LLM as an unreliable microservice: cache, queue, validate, fall back.',
      'Spaced-repetition math (FSRS) is a better differentiator than another chat UI.',
    ],
    liveUrl: 'https://vokan-two.vercel.app/',
    demo: 'fsrs',
    sourceRefs: CANONICAL,
  },
  {
    id: 'risk-engine',
    name: 'Core Banking Risk Engine',
    kind: 'systems',
    period: '2023 – 2024',
    role: 'Backend / Systems Engineer (remote)',
    summary:
      'A parallel risk computation engine for regulated core banking. Five isolated cores each evaluate one risk dimension; a central orchestrator dispatches jobs and normalizes results into a final score — with crash isolation by construction.',
    problems: [
      'Heavy risk matrices computed over live transactions with strict correctness.',
      'One failing evaluator must not poison the pipeline.',
      'Latency must be predictable for regulated flows.',
    ],
    solutions: [
      'Decomposed evaluation into 5 isolated processing cores: High-Risk Areas, Birthplace, Citizenship, Live Transactions, User Profile.',
      'Central orchestrator dispatches concurrent worker jobs, tracks independent states, and combines multi-source inputs into a final normalized risk score.',
      'Pipelines tuned for data consistency, predictable latency, and crash isolation.',
    ],
    architecture: [
      'Ingress → Orchestrator → 5 parallel cores → Aggregation → Normalized risk score',
    ],
    tech: ['Node.js', 'Worker processes', 'Job orchestration', 'Concurrency control'],
    metrics: [
      { label: 'Cores', value: '5 isolated evaluators' },
      { label: 'Domain', value: 'Regulated banking' },
    ],
    lessons: [
      'Isolation boundaries are the cheapest reliability you can buy.',
      'Normalizing heterogeneous signals into one score is a product problem wearing a systems costume.',
    ],
    demo: 'risk-engine',
    sourceRefs: CANONICAL,
  },
  {
    id: 'hitobit',
    name: 'Hitobit & Poolkhord',
    kind: 'platform',
    period: '2019 – 2021',
    role: 'Head of Frontend Development, Septa Pay',
    summary:
      'A crypto exchange and a B2B financial ecosystem sharing one JavaScript core across Web, Mobile, and Desktop. Custom state engines kept multi-currency ledger transactions exact under pressure.',
    problems: [
      'Multi-currency transactions need race-free, auditable client state.',
      'Three platforms had to stay behaviorally identical.',
    ],
    solutions: [
      'Custom state management engines and API abstraction layers built for financial flows.',
      'Shared JavaScript core across React/Next.js (web), React Native (mobile), and Electron (desktop).',
      'Strict client-side validation and transaction checks tailored to blockchain networks.',
    ],
    architecture: ['Shared JS core → platform adapters (Web / Mobile / Desktop) → exchange APIs'],
    tech: ['React', 'Next.js', 'React Native', 'Electron', 'Custom state engines'],
    metrics: [{ label: 'Platforms served', value: 'Web · Mobile · Desktop' }],
    lessons: [
      'When the domain is money, generic state libraries stop being enough — design your own engine.',
    ],
    demo: 'none',
    sourceRefs: CANONICAL,
  },
  {
    id: 'reqo',
    name: 'Reqo',
    kind: 'mobile',
    period: '2015 – 2019',
    role: 'Creator — built, published, sold, supported',
    summary:
      'A React Native product published on CodeCanyon: 20+ first-week sales and Top Seller at Apadana. The first full loop of building, selling, and supporting a product for enterprise buyers.',
    problems: ['Ship a marketplace-quality mobile product solo, then support paying customers.'],
    solutions: [
      'Built and published on CodeCanyon with documentation and enterprise buyer support.',
      'Handled sales, updates, and technical support end-to-end.',
    ],
    architecture: ['React Native app → REST backend (PHP, JWT auth) → relational schema'],
    tech: ['React Native', 'PHP', 'REST', 'JWT', 'MySQL'],
    metrics: [{ label: 'First week', value: '20+ sales, Top Seller' }],
    lessons: [
      'Owning the whole loop — build, sell, support — is the fastest way to grow product judgment.',
    ],
    demo: 'none',
    sourceRefs: CANONICAL,
  },
  {
    id: 'nexus',
    name: 'Nexus Sandbox',
    kind: 'product',
    period: '2026 – Present',
    role: 'Sole engineer — this world itself',
    summary:
      'The site you are standing in: an explorable digital twin built with React Three Fiber, a zod-validated living content model, a local-first RAG assistant, and a dynamic resume generator. It is simultaneously the portfolio and its own proof of work.',
    problems: [
      'Prove Three.js/WebGL and RAG capability with evidence instead of claims.',
      'One content model must power UI, knowledge graph, AI answers, and generated resumes.',
    ],
    solutions: [
      'Living Content System: zod schemas over typed content with per-fact source references.',
      'Deterministic chunking feeding a local BM25 retriever, with optional embeddings + edge LLM generation.',
      'Hub-and-district 3D world with guided and explorer modes, honoring reduced-motion and a full HTML fallback.',
    ],
    architecture: [
      'Content model → districts / knowledge graph / RAG chunks / resume presets',
      'R3F canvas + DOM OS shell, lazy-loaded district scenes, Zustand world state',
    ],
    tech: ['React 19', 'TypeScript', 'React Three Fiber', 'Zustand', 'Tailwind 4', 'zod', 'Vite'],
    metrics: [{ label: 'Role', value: 'Portfolio and proof simultaneously' }],
    lessons: [
      'Being the first user of your own learning list (Three.js, RAG) closes gaps faster than courses.',
    ],
    demo: 'none',
    sourceRefs: ['docs/PROFILE.md'],
  },
];
