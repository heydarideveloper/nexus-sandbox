# Testing Report — Nexus Sandbox v1.0

Date: 2026-07-04 · All gates green at commit time.

## Summary

| Suite                                     | Tool                           | Count                               | Result                |
| ----------------------------------------- | ------------------------------ | ----------------------------------- | --------------------- |
| Unit — content model                      | Vitest                         | part of 60                          | ✅ pass               |
| Unit — resume presets                     | Vitest                         | part of 60                          | ✅ pass               |
| Unit — RAG retrieval + hallucination gate | Vitest                         | part of 60                          | ✅ pass               |
| **Unit total**                            | Vitest                         | **60 tests / 3 files**              | ✅ 60/60              |
| E2E — world journeys (desktop Chrome)     | Playwright                     | 20                                  | ✅ pass               |
| E2E — world journeys (Pixel 7 mobile)     | Playwright                     | 20                                  | ✅ pass               |
| **E2E total**                             | Playwright                     | **40 tests**                        | ✅ 40/40              |
| Accessibility                             | @axe-core/playwright           | `/os` (desktop+mobile), mode select | ✅ 0 serious/critical |
| Static                                    | ESLint + Prettier + tsc strict | —                                   | ✅ clean              |
| Dependencies                              | `npm audit --audit-level=high` | —                                   | ✅ 0 vulnerabilities  |

## What the E2E suite proves

- Boot sequence renders and is skippable; both Guided and Explorer modes enter the world.
- Every district (Identity, Brain, Career, Lab, Factory, Observatory, Automation, Mission)
  opens via keyboard quick-travel with real content from the model, and closes with Escape.
- World power rises with exploration; achievements unlock and toast.
- The Jackpot live slots demo runs a full server-authoritative round.
- Chat twin answers evidence-backed questions **without any API** (local retrieval fallback)
  and **refuses** questions with no evidence.
- `/os` renders all ten content sections; resume studio switches presets with verbatim facts;
  links back to the 3D world.

## Flakiness fixed during the quality loop

1. **Dialog wouldn't close under load** — root cause was twofold: portal proximity auto-open
   re-triggered instantly after close (fixed: disarm while active, re-arm on exit), and the
   Radix + framer-motion exit animation needed rAF frames a starved main thread couldn't
   deliver (fixed: removed exit animation — closing is now synchronous).
2. **Headless WebGL contention** — parallel workers each software-render a canvas; fixed with
   `workers: 1`, plus scene degradation when SwiftShader/llvmpipe is detected.
3. **Axe caught mid-animation frames** — the resume card faded in from `opacity: 0` over a
   dark background, so axe measured blended colors (contrast 1.01). Fixed by removing the
   entry animation on the print card and waiting for settle in the mode-select scan.
4. **Wrong assertion** — the AI preset test looked for a bullet that preset correctly filters
   out; the assertion now checks the preset's actual summary content.

## Known gaps / future work

- No visual-regression snapshots (candidate: Playwright screenshots per district).
- LLM answer quality is unit-tested at the retrieval layer only; live-key eval harness is a
  roadmap item (needs the deploy credential).
- FPS budget (60/30) is observed via the dev overlay, not asserted in CI.
