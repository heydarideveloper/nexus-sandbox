# Deployment Guide — Nexus Sandbox

Target platform: **Vercel** (static build + one Edge function). See ADR-007.

## Prerequisites

- Node 22+ and npm.
- A Vercel account (hobby tier is sufficient).
- Optional: an OpenAI API key (enables generative chat answers; without it the assistant runs
  retrieval-only — everything else is unaffected).

## First deploy

```bash
# from the repo root
npm install
npm run build          # sanity check locally first
npx vercel             # link the project, accept the detected settings
npx vercel --prod
```

`vercel.json` already configures:

- `buildCommand: npm run build`, `outputDirectory: dist`
- SPA rewrites (everything except `/api/*`, assets, `robots.txt`, `rag-index.json` → `index.html`)
- Security headers + CSP, immutable caching for `/assets/*`

The `api/chat.ts` file is picked up automatically as an Edge function at `/api/chat`.

## Environment variables (Vercel → Project → Settings → Environment Variables)

| Variable         | Required | Effect                                                                                      |
| ---------------- | -------- | ------------------------------------------------------------------------------------------- |
| `OPENAI_API_KEY` | No       | Edge function calls gpt-4o-mini for generated, cited answers. Absent ⇒ retrieval-only mode. |

**This is the single credential TODO flagged in the plan.** Set a spend limit on the key and
consider Vercel rate limiting for `/api/chat` (see SECURITY-REPORT recommendations).

## Optional: semantic index

Embeddings improve retrieval but are not required (BM25 is the baseline):

```bash
OPENAI_API_KEY=sk-... npm run build:index   # writes public/rag-index.json
git add public/rag-index.json && git commit -m "chore: refresh rag index"
```

Regenerate whenever `src/content/` changes materially.

## CI

`.github/workflows/ci.yml` runs on every push/PR: lint, format check, build, unit tests,
`npm audit --audit-level=high`, then Playwright E2E (Chromium) against the production build.
Connect the GitHub repo to Vercel for preview deployments per PR.

## Post-deploy checklist

1. `curl -I https://<domain>/` — confirm CSP + security headers.
2. Visit `/` — boot → mode select → world loads; `/os` renders all sections.
3. Ask the chat drone "Tell me about Portal.ir" — expect a cited answer (`mode: llm` with key,
   retrieval cards without).
4. Print a resume from Mission Control or `/os#resume` — verify the print stylesheet.
5. Re-run Lighthouse against the live URL and update `PERFORMANCE-REPORT.md` baselines.

## Rollback

Vercel keeps immutable deployments — promote any previous deployment from the dashboard, or
`npx vercel rollback`.
