# ADR-002: Technology Stack

**Decision:** Vite + React 19 + TypeScript (strict) + React Three Fiber/drei/postprocessing +
Zustand + Tailwind CSS 4 + Radix Dialog + Framer Motion + GSAP + Howler + zod + d3-force-3d +
React Router.

**Context:** The experience mixes an OS-style DOM shell (HUD, terminals, dialogs) with 3D world
scenes, driven by one typed content model. Mohammad's stated preferred direction: Three.js, R3F,
React, TypeScript, Vite, GSAP, Framer Motion, Zustand, Tailwind.

**Decision matrix (frontend foundation):**

| Technology         | Performance | Fit with profile        | Ecosystem | Cost | Score                                                                    |
| ------------------ | ----------- | ----------------------- | --------- | ---- | ------------------------------------------------------------------------ |
| Vite + React + R3F | 9           | 10 (his daily stack)    | 10        | 10   | 9.7                                                                      |
| Next.js + R3F      | 8           | 9                       | 10        | 10   | 8.9 (SSR adds nothing to a client-side world; fallback route covers SEO) |
| Svelte + Threlte   | 9           | 4 (no profile evidence) | 6         | 10   | 6.6                                                                      |
| Vanilla Three.js   | 10          | 7                       | 8         | 10   | 8.4 (loses declarative scene composition)                                |

**Notable sub-decisions:**

- **Zustand over Redux/Valtio** — matches resume evidence, minimal overhead for per-frame reads via
  transient subscriptions.
- **d3-force-3d over react-force-graph-3d** — react-force-graph bundles its own Three renderer,
  which would double the WebGL footprint; we run the d3-force-3d simulation inside our existing
  R3F canvas instead.
- **GSAP for camera choreography, Framer Motion for DOM** — one timeline engine per rendering
  domain; no overlap.
- **Howler for audio** — sprite/caching support, tiny, battle-tested. Elementary Audio rejected
  (DSP engine is overkill).
- **zod v4 for the content model** — validation at build/test time keeps runtime cost zero.
- **Tailwind 4 + Radix Dialog** — accessible primitives for the OS shell without a component
  library payload.

**Reconsider when:** WebGPU-first rendering becomes table stakes (evaluate TSL/three-gpu), or the
content model moves server-side (re-evaluate Next.js).
