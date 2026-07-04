# Final Acceptance Checklist — Nexus Sandbox v1.0

Verified 2026-07-04 against the accepted plan (`nexus_sandbox_digital_twin` — stages 1–4).

## Product

- [x] Boot sequence (skippable) → mode select → 3D world; Guided Tour and Explorer modes.
- [x] Drone navigation: keyboard movement + accessible quick-travel bar.
- [x] All 8 districts open with real content; no placeholder text anywhere.
- [x] World power rises with exploration; skyline/audio/particles react; achievements toast
      and persist across sessions.
- [x] 5 hidden terminals reveal Engineering Notes.
- [x] Live demos run (server-authoritative slots, risk cores, FSRS).
- [x] "Talk with Mohammad" answers from evidence with citations and refuses without evidence —
      including with **zero backend** (local retrieval fallback).
- [x] Resume generator: 6 presets, deterministic, verbatim facts, print-to-PDF.
- [x] `/os` fallback carries 100% of the content, no WebGL.

## Truthfulness

- [x] Every content entity carries `sourceRefs`; unit tests enforce it.
- [x] Skills the profile is still learning are labeled `learning` and capped ≤ 60%.
- [x] Conflicting source (`Mohammad_CS.pdf`) excluded and documented.

## Quality gates

- [x] ESLint, Prettier, `tsc` strict — clean.
- [x] Vitest: 60/60. Playwright: 40/40 (desktop + mobile).
- [x] axe: 0 serious/critical on `/os` (both viewports) and mode select.
- [x] Lighthouse (desktop, prod build): perf 0.97 / a11y 1.0 / BP 1.0 / SEO 1.0 on both routes;
      FCP 0.8–0.9 s, LCP 1.0 s — within budget (FCP < 1.5 s, LCP < 2.5 s).
- [x] Initial JS ≈ 185 KB gzip (< 250 KB budget); Three.js lazy-loaded.
- [x] `npm audit --audit-level=high`: 0 vulnerabilities.
- [x] Security headers + CSP configured; no secrets in the client bundle.
- [x] `prefers-reduced-motion` honored; WebGL failure falls back gracefully.

## Documentation

- [x] PROFILE, PRINCIPLES, ADR-001…007, HLD, LLD.
- [x] Risk register, testing report, performance report, security report, asset inventory.
- [x] README, CHANGELOG, deployment guide, `.env.example`.

## Deployment readiness

- [x] `vercel.json` (build, rewrites, headers, caching) + edge function in `api/`.
- [x] GitHub Actions CI (lint, format, build, unit, audit, E2E).
- [x] Git repository initialized with the full history of this release.
- [ ] **Deploy-time TODO (user action):** set `OPENAI_API_KEY` in Vercel for generative chat;
      optionally run `npm run build:index` to ship semantic embeddings; connect the GitHub
      repo (`heydarideveloper`) and promote to production.
