# Changelog

All notable changes to Nexus Sandbox. Format follows Keep a Changelog; versions follow SemVer.

## [0.2.0] — 2026-07-05

Mobile & tablet adaptation layer (desktop v1 unchanged in gameplay and progression). See
`docs/adr/ADR-008-mobile-adaptation.md`.

### Added

- Device capability probe and quality tier store (`ultra` → `battery`) with HUD override and battery
  saver.
- Runtime frame-time governor (degrade/recover) wired to quality flags.
- Virtual joystick + logical input layer; keyboard desktop path preserved.
- Camera profiles per screen class; Brain touch OrbitControls tuning.
- Safe-area + `100dvh` layout; phone HUD compaction; chat bottom sheet; toast repositioning.
- Hub render pause behind overlays; progressive effect mount; tier-gated stars/clouds/particles/bloom.
- Dev perf overlay (`?perf=1`).
- Playwright mobile touch tests, Brain district test, iPad viewport project.

### Changed

- Portal taglines show on proximity (not hover-only); Lab demo hint always visible on small screens.
- RiskEngineDemo cores stack on narrow viewports; Factory node tap targets enlarged; Brain empty
  state visible on mobile.
- Explorer hint copy corrected (no false “drag to orbit” on hub).

## [0.1.0] — 2026-07-04

First production-ready release: the complete v1 digital twin (evolution stages 1–4).

### Added

- **Profile foundation:** `docs/PROFILE.md` — 20-section evidence-backed profile report; every
  product claim traces to it.
- **Living content model:** Zod-validated entities (profile, 6 experiences, projects, skill
  graph with honest `learning` statuses, learning goals, achievements, automations,
  experiments, engineering notes, districts), each with `sourceRefs`.
- **OS shell:** skippable terminal boot sequence, Guided/Explorer mode select, HUD with world
  power + achievements + keyboard quick-travel, toasts, procedural WebAudio soundscape,
  reduced-motion support.
- **3D hub world:** drone avatar (WASD/arrows + quick travel), instanced skyline that
  brightens with world power, particle field, 8 district portals with proximity auto-open,
  5 hidden terminals unlocking Engineering Notes.
- **Eight districts:** Identity Plaza (animated counters, parallax), The Brain (3D
  force-directed knowledge graph with evidence panels), Career Line (metro-line timeline),
  Innovation Lab (project workbenches with live demos: server-authoritative slots, parallel
  risk cores, FSRS scheduler), System Design Factory (animated architecture diagrams),
  Learning Observatory (honest progress), Automation Center (pipeline board), Mission Control
  (finale: resume terminal + contact).
- **AI assistant "Talk with Mohammad":** content chunking, BM25 retrieval with answerability
  gate, Vercel Edge chat function with persona guardrails and citations, optional build-time
  OpenAI embeddings, three-layer degradation (LLM → edge retrieval → local retrieval).
- **Resume generator:** six audience presets projected deterministically from the content
  model, print-CSS PDF export, verbatim facts only.
- **Accessibility:** full `/os` HTML fallback route (Lenis smooth scroll, all ten sections),
  axe-clean (0 serious/critical), keyboard navigation throughout, `<main>` landmarks.
- **Quality infrastructure:** strict TS, ESLint + Prettier, 60 Vitest unit tests, 40
  Playwright E2E tests (desktop + Pixel 7), GitHub Actions CI, security headers + CSP,
  performance budgets met (desktop FCP 0.9 s, LCP 1.0 s, initial JS ≈ 185 KB gzip).
- **Documentation:** PRINCIPLES, ADRs 001–007, HLD, LLD, risk register, testing/performance/
  security reports, asset inventory, deployment guide.

### Fixed (during the quality loop)

- District dialog could re-open instantly after closing (portal proximity auto-open now
  disarms while a district is active).
- Dialog close depended on exit-animation frames and hung under main-thread starvation
  (exit animation removed; close is synchronous).
- Axe contrast false-positives from entry animations on the resume card and mode-select scan.
- BM25 tokenizer missed dotted terms ("portal.ir"); answerability gate recalibrated with
  query-term coverage to prevent hallucination-prone answers.
- Scene now detects software WebGL (SwiftShader/llvmpipe) and drops effects instead of
  rendering at unusable frame rates.

### Removed

- Unused dependencies `howler` and `gsap` (procedural WebAudio and R3F `useFrame` cover both).

### Known limitations

- Generative answers require `OPENAI_API_KEY` at deploy (the one credential TODO); without it
  the assistant serves cited evidence cards.
- Evolution stages 5–8 (presence, real vector DB, WebGPU, CMS editing) are roadmap items.
