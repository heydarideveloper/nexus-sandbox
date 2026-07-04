import type { Experience } from './schema';

const CANONICAL = ['resume/resume.tex', 'resume/MOHAMMAD_HEYDARI_Full (1).pdf'];

/** Career stations, newest first. Every claim traces to the canonical resume files. */
export const experiences: Experience[] = [
  {
    id: 'vokan',
    company: 'VoKaN',
    tagline: 'AI-Powered Language Education Platform',
    role: 'Senior Full-Stack Engineer (Core Portfolio Project)',
    period: { from: 2026, to: null },
    domain: 'AI EdTech',
    theme: { accent: '#34d399', mood: 'Organic greens and soft glow — learning that grows.' },
    metrics: [
      { label: 'Languages supported', value: '13+' },
      { label: 'Platforms', value: 'iOS · Android · Web' },
      { label: 'LLM', value: 'gpt-4o-mini, structured JSON' },
    ],
    problems: [
      'Deliver one vocabulary product natively across iOS, Android, and Web from a single codebase.',
      'Generate reliable learning content with an LLM without breaking the UI on malformed output.',
      'Run a real relational database offline in the browser despite cross-origin isolation rules.',
    ],
    architecture: [
      'React Native (Expo 56) on the New Architecture with a shared core across all three platforms.',
      'OpenAI gpt-4o-mini with structured JSON outputs, local caching, fallback queues, and lazy translation pipelines.',
      'FSRS (Free Spaced Repetition Scheduler) mathematical model inside expo-sqlite computing card stability, difficulty, and review schedules.',
      'SQLite WASM on web unblocked by fixing COOP/COEP cross-origin isolation via custom Metro proxy scripts.',
    ],
    bullets: [
      {
        text: 'Built a production vocabulary app with React Native (Expo 56) and the New Architecture across iOS, Android, and Web.',
        facets: ['frontend', 'startup', 'ai'],
      },
      {
        text: 'Integrated OpenAI (gpt-4o-mini) with structured JSON outputs for dynamic content creation; implemented local caching, fallback queues, and lazy translation pipelines for 13+ languages.',
        facets: ['ai', 'system-design', 'startup'],
      },
      {
        text: 'Implemented FSRS spaced-repetition modeling in expo-sqlite to calculate card stability, difficulty, and review schedules.',
        facets: ['system-design', 'ai'],
      },
      {
        text: 'Shipped interactive review UI with drag-and-drop morpheme puzzles (Reanimated, Gesture Handler) and LLM-based grammar evaluation.',
        facets: ['frontend', 'ai'],
      },
      {
        text: 'Fixed COOP/COEP cross-origin isolation blockers to run high-performance SQLite WASM storage in browser builds via custom Metro proxy scripts.',
        facets: ['frontend', 'system-design'],
      },
    ],
    lessons: [
      'Structured outputs turn an LLM from a demo into a dependable component — validate everything at the boundary.',
      'Offline-first design forces honest thinking about state ownership and sync.',
    ],
    tech: [
      'React Native',
      'Expo 56',
      'TypeScript',
      'OpenAI API',
      'SQLite / WASM',
      'FSRS',
      'Reanimated',
      'Gesture Handler',
    ],
    liveUrl: 'https://vokan-two.vercel.app/',
    sourceRefs: CANONICAL,
  },
  {
    id: 'jackpot',
    company: 'Jackpot',
    tagline: 'Server-Authoritative Slot Game Platform',
    role: 'Senior Full-Stack Engineer (Core Portfolio Project)',
    period: { from: 2026, to: null },
    domain: 'Real-Time Gaming',
    theme: {
      accent: '#f59e0b',
      mood: 'Dramatic gold and neon — a casino floor that cannot be cheated.',
    },
    metrics: [
      { label: 'Load tested', value: '10,000 concurrent WebSocket connections' },
      { label: 'Protocol', value: 'Custom binary WebSocket codec' },
      { label: 'Authority', value: '100% server-side RNG, paylines, wallets' },
    ],
    problems: [
      'Prevent client-side tampering in a game where money-like state is at stake.',
      'Keep animations instant while every result is decided on the server.',
      'Handle concurrent spin race conditions on shared wallet state.',
    ],
    architecture: [
      'NestJS core engine owning RNG generation, payline checks, and user wallet state.',
      'Custom binary WebSocket protocol with a shared client/server codec: low-latency messaging, GET_ROUND_RESULT state recovery, lightweight heartbeats.',
      'TypeORM over PostgreSQL/SQLite for consistency; Redis distributed spin-locking for concurrent spins.',
      'React 19 + Vite + Zustand frontend rendering server-authoritative rounds with rapid animations.',
      'Custom load-testing script simulating 10,000 concurrent WebSocket connections.',
    ],
    bullets: [
      {
        text: 'Architected a server-authoritative slot engine in NestJS where the backend fully controls RNG, payline checks, and wallet state to prevent client-side tampering.',
        facets: ['system-design', 'enterprise', 'startup'],
      },
      {
        text: 'Built a custom binary WebSocket protocol with a shared client/server codec for low-latency messaging, quick state recovery, and lightweight heartbeats.',
        facets: ['system-design', 'frontend'],
      },
      {
        text: 'Managed data consistency with TypeORM (PostgreSQL/SQLite) and handled concurrent spin race conditions with distributed spin-locking via Redis.',
        facets: ['system-design', 'enterprise'],
      },
      {
        text: 'Developed a React 19 + Vite frontend with Zustand for rapid slot animations and real-time balance sync driven by server event streams.',
        facets: ['frontend', 'startup'],
      },
      {
        text: 'Created a custom load-testing script simulating 10,000 concurrent WebSocket connections to verify backend stability and message latency under load.',
        facets: ['system-design', 'enterprise'],
      },
    ],
    lessons: [
      'Authority boundaries must be architectural, not procedural — the client renders, the server decides.',
      'A binary protocol is only worth it when you own both ends; the shared codec made it safe.',
    ],
    tech: [
      'NestJS',
      'React 19',
      'Vite',
      'Zustand',
      'WebSockets',
      'TypeORM',
      'PostgreSQL',
      'Redis',
      'SQLite',
    ],
    liveUrl: 'https://frontend-ten-indol-10.vercel.app/',
    sourceRefs: CANONICAL,
  },
  {
    id: 'portal',
    company: 'Portal.ir',
    tagline: 'Large-Scale SaaS Platform',
    role: 'Senior Full-Stack Engineer / Frontend Team Lead',
    period: { from: 2024, to: null },
    domain: 'SaaS',
    theme: { accent: '#22d3ee', mood: 'Clean cyan grids — a city of ten thousand tenant sites.' },
    metrics: [
      { label: 'Users', value: '540,000+' },
      { label: 'Active websites', value: '10,000+' },
      { label: 'Production errors', value: '−35%' },
    ],
    problems: [
      'Serve 540K+ users and 10K+ tenant websites from one coherent frontend architecture.',
      'Rendering and caching bottlenecks across a multi-tenant surface.',
      'Frequent production errors from tangled state and routing.',
    ],
    architecture: [
      'React + Next.js core layout systems and data structures for multi-tenant site creation, dynamic app configuration, and automated site lifecycle management.',
      'SSR/ISR and optimized network layers balancing performance, scalability, and consistency.',
      'Strict state isolation, runtime validation schemas, and decoupled routing structures.',
    ],
    bullets: [
      {
        text: 'Led React/Next.js architecture for a SaaS platform serving 540,000+ users and 10,000+ active websites.',
        facets: ['frontend', 'enterprise', 'leadership'],
      },
      {
        text: 'Built multi-tenant site creation, dynamic app configuration, and automated site lifecycle management workflows at scale.',
        facets: ['system-design', 'enterprise'],
      },
      {
        text: 'Applied Next.js SSR/ISR and optimized network layers to resolve rendering and caching bottlenecks.',
        facets: ['frontend', 'system-design'],
      },
      {
        text: 'Cut production errors by ~35% via state isolation, runtime validation schemas, and decoupled routing.',
        facets: ['frontend', 'enterprise', 'system-design'],
      },
      {
        text: 'Managed cross-team alignment, led internal tech reviews, established coding standards, and defined backend API contracts.',
        facets: ['leadership', 'enterprise'],
      },
    ],
    lessons: [
      'At scale, most "frontend bugs" are architecture bugs: isolate state, validate at runtime, decouple routes.',
      'API contracts defined together with backend teams prevent whole classes of integration failures.',
    ],
    tech: ['React', 'Next.js', 'TypeScript', 'SSR/ISR', 'Zustand', 'Node.js'],
    sourceRefs: CANONICAL,
  },
  {
    id: 'banking',
    company: 'Core Banking Risk Project',
    tagline: 'Parallel Risk Computation Engine (Remote)',
    role: 'Backend / Systems Engineer',
    period: { from: 2023, to: 2024 },
    domain: 'Core Banking',
    theme: { accent: '#818cf8', mood: 'Deep indigo vaults — regulated, isolated, precise.' },
    metrics: [
      { label: 'Processing cores', value: '5 isolated' },
      { label: 'Domain', value: 'Regulated core banking' },
    ],
    problems: [
      'Compute complex risk scores over live financial data with strict correctness requirements.',
      'One failing check must never take down the whole evaluation pipeline.',
    ],
    architecture: [
      'Node.js parallel risk computation engine for a highly regulated core banking infrastructure.',
      'Risk matrices split into 5 isolated processing cores: High-Risk Areas, Birthplace, Citizenship, Live Transactions, and User Profile.',
      'Central orchestrator dispatching concurrent worker jobs, handling independent states, and combining multi-source inputs into a final risk score.',
    ],
    bullets: [
      {
        text: 'Built a parallel risk computation engine in Node.js with 5 isolated processing cores and a central job orchestrator for regulated core banking.',
        facets: ['system-design', 'enterprise'],
      },
      {
        text: 'Optimized financial transaction pipelines for data consistency, predictable latency, and crash isolation.',
        facets: ['system-design', 'enterprise'],
      },
    ],
    lessons: [
      'Crash isolation is a design input, not an afterthought — independent cores kept one failure from becoming five.',
      'Predictable latency beats peak throughput in regulated pipelines.',
    ],
    tech: ['Node.js', 'Parallel processing', 'Job orchestration', 'Concurrency control'],
    sourceRefs: CANONICAL,
  },
  {
    id: 'pezeshket',
    company: 'Pezeshket (5040 Holding)',
    tagline: 'Telemedicine Platform',
    role: 'Senior Full-Stack Engineer / Technical Team Lead',
    period: { from: 2021, to: 2023 },
    domain: 'Healthcare',
    theme: {
      accent: '#f8fafc',
      mood: 'Clinical white light and calm interfaces — care under load.',
    },
    metrics: [
      { label: 'Doctors', value: '5,000+' },
      { label: 'Concurrent sessions', value: '7,000+' },
      { label: 'Consultations', value: 'Thousands daily' },
    ],
    problems: [
      'Real-time medical consultations cannot drop — reliability over styling.',
      'Thousands of daily patient requests routed to the right doctors with complex scheduling.',
    ],
    architecture: [
      'Full-stack systems for live medical rooms, interactive clinic dashboards, and admin control panels.',
      'Complex scheduling, routing, and secure communication flows.',
      'Stability maintained for 7,000+ concurrent live sessions, prioritizing state processing, data speed, and uptime.',
    ],
    bullets: [
      {
        text: 'Scaled a real-time healthcare platform used by 5,000+ certified medical professionals handling thousands of daily patient consultation requests.',
        facets: ['frontend', 'enterprise', 'system-design'],
      },
      {
        text: 'Designed live medical rooms, interactive clinic dashboards, and admin control panels; maintained stability for 7,000+ concurrent sessions.',
        facets: ['frontend', 'system-design'],
      },
      {
        text: 'Mentored junior and mid-level engineers, introduced code review practices, and tracked performance and code quality metrics.',
        facets: ['leadership'],
      },
    ],
    lessons: [
      'In healthcare, correctness and uptime are features; visual polish is negotiable, dropped calls are not.',
      'Code review culture is built by example and metrics, not mandates.',
    ],
    tech: ['React', 'Node.js', 'WebSockets', 'Real-time UI', 'Dashboards'],
    sourceRefs: CANONICAL,
  },
  {
    id: 'septa',
    company: 'Septa Pay',
    tagline: 'FinTech & Blockchain Platforms — Hitobit, Poolkhord',
    role: 'Head of Frontend Development',
    period: { from: 2019, to: 2021 },
    domain: 'FinTech / Blockchain',
    theme: { accent: '#3b82f6', mood: 'Blue neon data streams — value in motion, verified twice.' },
    metrics: [
      { label: 'Products', value: 'Hitobit (crypto exchange) · Poolkhord (B2B financial)' },
      { label: 'Platforms', value: 'Web · Mobile · Desktop from one shared core' },
      { label: 'Team', value: 'Led 2 engineers' },
    ],
    problems: [
      'Multi-currency ledger transactions demand exact, race-free client state.',
      'Three platforms (web, mobile, desktop) needed one consistent business logic layer.',
      'Blockchain-based flows required strict client-side validation before anything hit the chain.',
    ],
    architecture: [
      'Custom state management engines and API abstraction layers for multi-currency transactions.',
      'Shared JavaScript core reused across Web (React/Next.js), Mobile (React Native), and Desktop (Electron).',
      'Strict client-side validations and transaction checks built specifically for blockchain networks.',
    ],
    bullets: [
      {
        text: 'Architected frontend systems for Hitobit (crypto exchange) and Poolkhord (B2B financial ecosystem) with custom state engines for multi-currency transactions.',
        facets: ['frontend', 'system-design', 'startup'],
      },
      {
        text: 'Built a shared JavaScript core reusing business logic across Web (React/Next.js), Mobile (React Native), and Desktop (Electron).',
        facets: ['frontend', 'system-design'],
      },
      {
        text: 'Enforced strict client-side validation and transaction checks for blockchain-based financial flows.',
        facets: ['frontend', 'enterprise'],
      },
      {
        text: 'Led a frontend team of 2 engineers with a focus on architecture and engineering discipline.',
        facets: ['leadership'],
      },
    ],
    lessons: [
      'A shared core across platforms is a product decision as much as a technical one — it changed release speed.',
      'Custom state engines are justified when the domain (money) outgrows generic stores.',
    ],
    tech: [
      'React',
      'Next.js',
      'React Native',
      'Electron',
      'Custom state engines',
      'Blockchain APIs',
    ],
    sourceRefs: CANONICAL,
  },
  {
    id: 'early',
    company: 'Early Career — Apadana, Bitfinity, freelance',
    tagline: 'Junior → Mid-level: PHP, Android, React Native',
    role: 'Software Engineer',
    period: { from: 2015, to: 2019 },
    domain: 'Foundations',
    theme: { accent: '#a3a3a3', mood: 'Warm workshop light — where the fundamentals were forged.' },
    metrics: [
      { label: 'Reqo on CodeCanyon', value: '20+ first-week sales, Top Seller' },
      { label: 'Domains', value: 'Logistics · Ticketing · E-commerce' },
    ],
    problems: [
      'Learn to ship: real products, real customers, real support tickets.',
      'Progress from PHP/Android foundations into the JavaScript ecosystem.',
    ],
    architecture: [
      'RESTful APIs, JWT authentication, and relational database schemas in PHP for web and mobile products.',
      'Native Android (Java) app prototypes backed by formal coursework.',
      'React Native product "Reqo" published on CodeCanyon with enterprise buyer support.',
    ],
    bullets: [
      {
        text: 'Published "Reqo" (React Native) on CodeCanyon with 20+ first-week sales; managed product sales and enterprise technical support.',
        facets: ['startup', 'frontend'],
      },
      {
        text: 'Developed RESTful APIs, JWT authentication, and relational schemas in PHP; built and launched native Android prototypes in Java.',
        facets: ['system-design'],
      },
      {
        text: 'Maintained enterprise web applications in logistics, ticketing, and e-commerce at Bitfinity, progressing to mid-level through JavaScript mastery.',
        facets: ['enterprise', 'frontend'],
      },
    ],
    lessons: [
      'Selling and supporting your own product teaches more about software than any tutorial.',
      'Strong fundamentals (HTTP, auth, data modeling) compound across every later stack.',
    ],
    tech: ['PHP', 'Java (Android)', 'React Native', 'MySQL', 'REST', 'JWT'],
    sourceRefs: CANONICAL,
  },
];
