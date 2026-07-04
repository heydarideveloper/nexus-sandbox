# ADR-007: Deployment & CI

**Decision:** Vercel for hosting (static `dist/` + one edge function `api/chat.ts`), GitHub Actions
for CI (lint, format check, typecheck-via-build, unit tests, audit, Playwright e2e). Security
headers + CSP declared in `vercel.json`.

**Options considered:**

| Option                           | Advantages                                                                              | Disadvantages                                 |
| -------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------- |
| Vercel (chosen)                  | His existing platform (VoKaN + Jackpot live there), free tier, edge functions colocated | api/ folder is Vercel-shaped (1 file to port) |
| Netlify                          | Equivalent                                                                              | No existing footprint                         |
| GitHub Pages + Cloudflare Worker | Fully OSS-ish                                                                           | Splits deploy into two systems (violates #1)  |
| Self-hosted Docker               | Max control                                                                             | A server to maintain for a static site        |

**Lock-in containment (principle #15):** everything except `api/chat.ts` is a plain static bundle;
headers are also documented in `docs/DEPLOYMENT.md` for nginx/Cloudflare equivalents.

**Reconsider when:** the AI layer grows stateful (sessions, memory) — then a small dedicated
backend service (NestJS, matching his stack) replaces the edge function.
