# Performance Report — Nexus Sandbox v1.0

Date: 2026-07-04 · Method: Lighthouse (headless Chrome, production build via `vite preview`).

## Budgets vs. measured (desktop preset)

| Metric            | Budget     | `/` (world)                                | `/os` (fallback) |
| ----------------- | ---------- | ------------------------------------------ | ---------------- |
| Performance score | ≥ 0.90     | **0.97**                                   | **0.97**         |
| FCP               | < 1.5 s    | **0.9 s**                                  | **0.8 s**        |
| LCP               | < 2.5 s    | **1.0 s**                                  | **1.0 s**        |
| TBT               | low        | **0 ms**                                   | **60 ms**        |
| CLS               | < 0.1      | **0.006**                                  | **0.01**         |
| Accessibility     | 1.0 target | **0.98 → 1.0** after `<main>` landmark fix | **1.0**          |
| Best practices    | 1.0        | **1.0**                                    | **1.0**          |
| SEO               | ≥ 0.9      | **1.0**                                    | **1.0**          |

Mobile-emulated runs (4× CPU throttle) fluctuate on the shared build machine (perf 0.55–0.72,
FCP 3.6–4.4 s) — dominated by simulated throttling of the ~185 KB gzip initial JS; scores
should be re-baselined on Vercel's CDN after deploy. Accessibility/BP/SEO are 1.0 on mobile.

## Bundle budget (initial JS < 250 KB gzip)

Production output (gzip):

| Chunk                                | Size         | Loaded when                             |
| ------------------------------------ | ------------ | --------------------------------------- |
| react vendor                         | 87.7 KB      | initial                                 |
| index (app + content model)          | 52.7 KB      | initial                                 |
| motion (framer-motion)               | 44.2 KB      | initial                                 |
| **Initial total**                    | **≈ 185 KB** | ✅ under budget                         |
| three vendor                         | 260.1 KB     | lazy — only after entering the 3D world |
| HubWorld + districts + chat + resume | 1–30 KB each | lazy per feature                        |

## Optimizations in place

- **Code splitting:** Three.js and every district/chat/resume component behind `lazy()`;
  manual vendor chunks (`three`, `motion`, `react`) for long-lived caching.
- **Fonts:** Google Fonts stylesheet loads with `media="print"` and is switched to `all` from
  the entry module (CSP-safe non-blocking pattern) + preconnect; system-font fallbacks paint
  first.
- **Rendering:** instanced skyline meshes, single points cloud for particles, adaptive DPR via
  `PerformanceMonitor`, Bloom only on high-end hardware, and a software-GL probe that drops
  DPR to 0.5 and disables Stars/particles/Bloom on SwiftShader/llvmpipe.
- **Caching:** immutable cache headers for `/assets/*` (vercel.json).
- **Zero media assets:** audio is procedurally synthesized (WebAudio); no textures or models
  are downloaded.

## Follow-ups

- Re-run Lighthouse against the production Vercel URL and pin numbers here.
- Consider self-hosting the two font families to remove the third-party request entirely.
- `unused-javascript` flags ~300 KB (ungzipped) of vendor code on `/os`; splitting framer-motion
  out of the `/os` path is a possible micro-win.

## Mobile frame-time methodology (v1.1 adaptation)

Added 2026-07-05 with ADR-008:

| Signal | Method |
| ------ | ------ |
| Tier selection | Static probe at init (`capability.ts`) → `ultra/high/medium/low/battery` |
| Runtime governor | Rolling 60-frame average in `FrameGovernor`; degrade after ~45 bad frames (>115% budget), recover after ~180 good frames (<85% budget) |
| Budgets | 16.7 ms (60 fps) for ultra/high/medium; 33.3 ms (30 fps) for low/battery |
| Hub pause | `frameloop="never"` when district overlay, chat, or engineering note is open |
| Validation | Playwright Pixel 7 + iPad projects; dev overlay via `?perf=1` (FPS, avg/p95 frame time, tier, device profile, JS heap) |

Expected wins on phone: hub pause behind overlays (largest), tier-gated stars/particles/bloom,
progressive effect mount, DPR cap 1.0–1.25 on low tiers.
