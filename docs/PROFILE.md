# Internal Profile Report — Mohammad Heydari

> **Status:** Single source of truth for every architectural, design, gameplay, and storytelling
> decision in the Nexus Sandbox project. All content rendered anywhere in the product MUST trace
> back to a claim in this document, and every claim in this document traces back to the evidence
> files listed in [Evidence Sources](#evidence-sources).

---

## Evidence Sources

| Source                                                                               | Type              | Role                                                                         |
| ------------------------------------------------------------------------------------ | ----------------- | ---------------------------------------------------------------------------- |
| `resume/resume.tex` + `resume/resume-preamble.tex`                                   | LaTeX (canonical) | Senior Frontend variant, most recently edited                                |
| `resume/resume-mid-general.tex`, `resume-mid-frontend.tex`, `resume-mid-backend.tex` | LaTeX             | Mid-level variants (calibration of claims)                                   |
| `resume/MOHAMMAD_HEYDARI_Full (1).pdf`                                               | PDF               | Fullest full-stack CV, richest technical detail                              |
| `resume/Mohammad Heydari.pdf`                                                        | PDF               | Frontend Lead variant; contains Leadership & Architecture Philosophy section |
| `resume/EPAM-Lead-AI-Engineer.pdf` and 14 other tailored variants                    | PDF               | Role-tailored variants (consistency cross-check)                             |
| `resume/Mohammad_CS.pdf`                                                             | PDF               | **EXCLUDED — see [Risks](#18-risks-in-personal-branding)**                   |

---

## 1. Executive Summary

Mohammad Heydari is a Senior Full-Stack Engineer and Frontend Team Lead based in Yerevan, Armenia,
with 10+ years (2015–present) of experience shipping production systems across **FinTech,
Blockchain, SaaS, Core Banking, and Telemedicine**. His center of gravity is **frontend
architecture at scale** — React, Next.js, React Native, Electron — backed by a genuinely strong
Node.js/NestJS systems capability (parallel computation engines, binary WebSocket protocols,
distributed locking). He has led teams, defined API contracts across organizations, and owned
products from MVP to 540,000+ users. Since 2026 he has been building AI-native products end-to-end
(OpenAI structured outputs, FSRS scheduling, LLM grammar evaluation), positioning himself as an
AI-native product engineer rather than a consumer of AI APIs.

**Contact:** m.heydari.developer@gmail.com · GitHub [heydarideveloper](https://github.com/heydarideveloper) ·
LinkedIn [mohammad-heydari](https://www.linkedin.com/in/mohammad-heydari-72391a1a1/) ·
Yerevan, Armenia · +374 55 599434

## 2. Skills Matrix

| Domain                                       | Depth                      | Evidence                                                         |
| -------------------------------------------- | -------------------------- | ---------------------------------------------------------------- |
| React / React ecosystem                      | Expert (10 yrs)            | Every role 2019→present; React 19 at Jackpot                     |
| Next.js (SSR/ISR)                            | Expert                     | Portal.ir architecture lead; Hitobit                             |
| TypeScript / JavaScript                      | Expert                     | All roles; strict typing across stacks                           |
| React Native (New Architecture)              | Expert                     | VoKaN (Expo 56), Reqo (2015-19), Septa Pay shared core           |
| State management (Zustand, custom engines)   | Expert                     | Hitobit custom state engines; Jackpot real-time sync             |
| Node.js / NestJS / Express                   | Advanced                   | Jackpot backend; Core Banking risk engine                        |
| WebSockets / real-time protocols             | Advanced                   | Custom binary codec (Jackpot); Pezeshket live rooms              |
| PostgreSQL / SQLite / Redis / TypeORM        | Advanced                   | Jackpot persistence + Redis spin-locks; VoKaN offline SQLite     |
| Concurrency / parallel processing            | Advanced                   | 5-core risk engine with orchestrator (2023-24)                   |
| LLM integration (OpenAI, structured outputs) | Working, production-proven | VoKaN gpt-4o-mini pipelines, grammar evaluation                  |
| Performance engineering                      | Advanced                   | Portal.ir −35% prod errors; 7K concurrent sessions at Pezeshket  |
| Docker / GCP                                 | Working                    | Listed consistently across variants                              |
| Electron                                     | Working                    | Septa Pay desktop apps                                           |
| Leadership / mentoring                       | Proven                     | Team Lead at Portal.ir, Pezeshket; Head of Frontend at Septa Pay |
| Three.js / WebGL                             | **Learning**               | No resume evidence — this project is the first proof             |
| Vector DBs / RAG / agents / MCP              | **Learning**               | No production evidence — rendered honestly as learning           |

## 3. Technology Graph

Core relationships (drives the Brain district):

- **JavaScript/TypeScript** is the root; everything branches from it.
- **React** → Next.js (SSR/ISR), React Native (Expo, Reanimated, Gesture Handler), Electron, Vite, Zustand.
- **Node.js** → NestJS, Express, parallel workers/orchestration, WebSocket servers.
- **Real-time** bridges frontend & backend: binary codecs, state recovery, heartbeats, server-authoritative rendering.
- **Data** → PostgreSQL, SQLite (incl. WASM in browser), Redis (caching + distributed locks), TypeORM.
- **AI** → OpenAI API, structured JSON outputs, LLM evaluation, caching/fallback queues; _learning:_ RAG, embeddings, vector DBs, agents, MCP.
- **Systems** → Docker, GCP, concurrency control, crash isolation, load testing (10K WS connections).

## 4. Career Timeline

| Period       | Organization                       | Role                                                 | Domain                                   |
| ------------ | ---------------------------------- | ---------------------------------------------------- | ---------------------------------------- |
| 2015–2019    | Apadana / Bitfinity / freelance    | Junior → Mid (PHP, Android/Java, React Native)       | Logistics, ticketing, e-commerce, mobile |
| 2019–2021    | Septa Pay (Hitobit, Poolkhord)     | Head of Frontend Development                         | FinTech / Blockchain                     |
| 2021–2023    | Pezeshket (5040 Holding)           | Senior Engineer / Technical Team Lead                | Telemedicine / Healthcare                |
| 2023–2024    | Core Banking Risk Project (remote) | Backend / Systems Engineer                           | Core Banking                             |
| 2024–present | Portal.ir                          | Senior Engineer / Frontend Team Lead                 | SaaS (multi-tenant)                      |
| 2026–present | VoKaN + Jackpot                    | Senior Full-Stack Engineer (core portfolio projects) | AI EdTech / Real-time Gaming             |

## 5. Project Timeline

1. **Reqo** (2015-19) — React Native app published on CodeCanyon; 20+ first-week sales, top seller at Apadana; enterprise support experience.
2. **Hitobit** (2019-21) — crypto exchange frontend; custom state engines for multi-currency ledger transactions; shared JS core across Web/Mobile/Desktop.
3. **Poolkhord** (2019-21) — B2B financial ecosystem, same shared-core architecture.
4. **Pezeshket** (2021-23) — live medical rooms, clinic dashboards, admin panels; 5,000+ doctors; 7,000+ concurrent sessions.
5. **Core Banking Risk Engine** (2023-24) — Node.js parallel computation: 5 isolated cores (High-Risk Areas, Birthplace, Citizenship, Live Transactions, User Profile) + central orchestrator normalizing final risk score.
6. **Portal.ir** (2024-) — multi-tenant site builder SaaS: 540,000+ users, 10,000+ active websites; SSR/ISR tuning; ~35% production error reduction via state isolation, runtime validation schemas, decoupled routing.
7. **VoKaN** (2026-) — AI language education: Expo 56 New Architecture (iOS/Android/Web), gpt-4o-mini structured outputs, FSRS spaced repetition in expo-sqlite, morpheme drag-and-drop puzzles, 13+ languages, SQLite WASM + COOP/COEP fixes. Live: https://vokan-two.vercel.app/
8. **Jackpot** (2026-) — server-authoritative slot platform: NestJS RNG/payline/wallet authority, custom binary WebSocket codec, Redis distributed spin-locking, TypeORM, React 19 + Vite + Zustand frontend, 10K-connection load test script. Live: https://frontend-ten-indol-10.vercel.app/

## 6. Leadership Evidence

- Head of Frontend Development at Septa Pay (led team of 2 engineers).
- Technical Team Lead at Pezeshket — mentored junior/mid engineers, introduced code review practices, tracked performance and quality metrics.
- Frontend Team Lead at Portal.ir — led tech reviews, established coding standards, defined backend API contracts, managed cross-team alignment.
- Stated philosophy (from CV): _"Facilitate technical decision-making within the team rather than dictating choices. Define boundaries and guide architecture discovery using structured frameworks (like Six Thinking Hats and Decide)."_

## 7. Architecture Experience

- High-Level Design focus: modular systems, loose coupling, clear data separation, predictable data flows.
- Parallel job processing with crash isolation (banking risk engine).
- Server-authoritative real-time systems with anti-tampering design (Jackpot).
- Multi-tenant SaaS layout/data-structure design (Portal.ir).
- Shared cross-platform JavaScript cores (Septa Pay).
- Offline-first local-storage architecture with sync (VoKaN).

## 8. Product Experience

- Published and sold a product on a marketplace (Reqo — sales + enterprise support).
- MVP → scale progression explicitly practiced (MVP1 → MVP2 language in CV).
- Two live self-directed products in production (VoKaN, Jackpot).
- Cross-functional collaboration with product and design at Portal.ir and Pezeshket.

## 9. AI Experience

**Production-proven:** OpenAI gpt-4o-mini integration with structured JSON outputs; LLM-based grammar evaluation; local caching, fallback queues, lazy translation pipelines for 13+ languages; agent-assisted delivery workflow.
**Learning (honest):** RAG pipelines, embeddings, vector databases, agents, MCP, fine-tuning. This project's assistant is itself the first RAG build.

## 10. Frontend Expertise

Deepest area. React (10 yrs, through React 19), Next.js SSR/ISR/dynamic routing, React Native New Architecture, Electron, Vite, Zustand + custom state engines, Reanimated/Gesture Handler, real-time UI driven by server event streams, performance-critical and data-heavy UI, Tailwind CSS.

## 11. Backend Expertise

Supporting strength, but with real depth: Node.js service-oriented design, NestJS, Express, REST + WebSocket APIs, binary protocol design, TypeORM/PostgreSQL/SQLite/Redis, distributed locking, parallel job orchestration, load testing, OpenAI API services.

## 12. System Design Experience

- Decomposition of heavy computation into isolated cores with a central orchestrator.
- Server-authoritative state machines to prevent client tampering.
- Data consistency under concurrency (Redis spin-locks for race conditions).
- Caching strategy layers (SSR/ISR, client caches, Redis).
- Cross-origin isolation problem-solving (COOP/COEP + WASM).

## 13. Visual Design Strengths

Strong product-UI execution (dashboards, live rooms, admin panels, game UI with rapid animations). Preference for cinematic, interactive, AAA-polish experiences (stated direction: Three.js, R3F, GSAP, Framer Motion, Lenis). No formal visual-design credential claimed — strength is _engineering-led_ UI quality.

## 14. Knowledge Gaps

1. Three.js/WebGL production work — none evidenced; this project is the proof-of-work.
2. Vector databases, RAG, agents, MCP — learning stage.
3. Public cloud beyond GCP basics; no AWS/K8s claims.
4. Formal CS credentials/certifications — none listed in any variant.
5. Open-source public footprint — GitHub exists but no headline OSS contributions cited.
6. Blockchain protocol-level work — experience is exchange _frontend_, not chain engineering.

## 15. Portfolio Opportunities

- The **System Design Factory** district can animate the actual risk engine and Jackpot architectures — turning his two most differentiating systems into interactive proof.
- **Jackpot live demo** inside Innovation Lab demonstrates real-time engineering viscerally.
- **Learning Observatory** converts gaps (§14) into a credibility asset ("never stops learning").
- The site itself closes gap #1 (Three.js) by existing.
- The RAG assistant closes gap #2 by being a documented experiment.

## 16. Recruiter Value Proposition

"A frontend-architecture expert who can also build your backend, who has actually operated at 540K-user scale, led teams in three companies, shipped real-time financial and healthcare systems where correctness mattered, and is now AI-native — demonstrated, not claimed, by the interactive world you are standing in."

## 17. Key Differentiators

1. Real scale numbers: 540K+ users, 10K+ websites, 7K+ concurrent sessions, 5K+ doctors.
2. Rare frontend+systems combination (binary protocols, parallel engines — not typical for frontend leads).
3. Regulated-domain experience: banking, healthcare, financial exchanges.
4. Full MVP→scale ownership repeatedly, including two live solo products.
5. Documented leadership philosophy (facilitation over dictation).
6. Honest learning posture — shows growth trajectory rather than static expertise.

## 18. Risks in Personal Branding

| Risk                     | Detail                                                                                                                                                                                                                                | Mitigation                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Conflicting CV in folder | `Mohammad_CS.pdf` presents "Mohammad Heidari, Customer Service & Sales" with Support roles at the same companies/periods (Portal.ir 2024-26, Pezeshket 2021-23). If ever seen alongside the engineering CV it undermines credibility. | **Excluded from twin. Recommend removing it from any shared portfolio folder.** |
| Date ambiguity           | "2026 – Present" for VoKaN/Jackpot alongside "2024 – Present" for Portal.ir implies parallel work; must always be framed as "core portfolio projects" (as the resumes do).                                                            | Framed exactly as resumes frame it.                                             |
| Over-tailored variants   | 15+ role-tailored PDFs (e.g. "Lead Unity Software Engineer" with no Unity content) could look inconsistent if leaked together.                                                                                                        | Twin uses only claims present in ALL engineering variants.                      |
| Unverifiable metrics     | 540K/10K/7K/35% cannot be independently verified.                                                                                                                                                                                     | Presented as-stated, attributed to the resume, never inflated.                  |

## 19. Recommendations

1. Delete or archive `Mohammad_CS.pdf` away from engineering materials.
2. Consolidate on the canonical LaTeX resume as the single upstream for all variants.
3. Publish VoKaN and Jackpot repos (or code excerpts) on GitHub to back the claims.
4. After this project ships, add "Three.js / R3F / WebGL" and "RAG / embeddings" to the resume with Nexus Sandbox as evidence.
5. Keep the "Learning" framing — it tested as a differentiator, not a weakness.

## 20. Engineering Identity Statement

> **"I design systems, not screens. I take products from first commit to hundreds of thousands of
> users, across the boundary between frontend and backend, in domains where correctness is
> non-negotiable — and I never stop learning. This world is not a description of that identity;
> it is an execution of it."**

Every district, mechanic, animation, and AI answer in Nexus Sandbox must be justifiable as an
expression of this statement.
