# Security Report — Nexus Sandbox v1.0

Date: 2026-07-04

## Threat model (what there is to protect)

A static personal site with one edge endpoint. Assets at risk: the OpenAI API key (cost),
the reputation of the twin (hallucinated claims), and visitors (XSS/clickjacking).
No user accounts, no PII collection, no database.

## Controls in place

### Headers / CSP (vercel.json, applied to all routes)

- `Content-Security-Policy`: `default-src 'self'`; scripts self-only (no inline handlers — the
  font-loading pattern was specifically built to avoid one); styles self + Google Fonts +
  `unsafe-inline` (required by Tailwind/inline style attributes); images self/data/blob;
  `frame-ancestors 'none'`; `base-uri 'self'`; `form-action 'self'`.
- `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy` denies camera/microphone/geolocation.

### Secrets

- The only credential is `OPENAI_API_KEY`, read **server-side only** in the edge function via
  `process.env`. It is never bundled: the client has no key path, and the app functions fully
  without it. `.env` is gitignored; `.env.example` documents the variable.

### Edge endpoint (`/api/chat`)

- Method restricted to POST, JSON body, question capped at 500 characters.
- No tool/function calling exposed to the model; retrieval corpus is static, self-authored
  content — no user data enters the prompt beyond the question itself.
- Model output is rendered as plain text (React escapes by default; no `dangerouslySetInnerHTML`
  anywhere in the codebase).
- Failure mode is degradation to retrieval-only, never an error page.
- Residual risk: cost abuse by repeated calls — mitigate at deploy with Vercel firewall
  rate-limiting and an OpenAI spend cap (documented in DEPLOYMENT.md and the risk register, R12).

### Supply chain

- `npm audit --audit-level=high`: **0 vulnerabilities** at release.
- Dependencies pinned via `package-lock.json`; CI re-audits on every push.
- No post-install scripts required by the app's dependencies.

### Client storage

- Only exploration progress (district visits, achievements) in `localStorage` — no sensitive
  data.

## Verification performed

- Grepped codebase: no `dangerouslySetInnerHTML`, no `eval`, no inline event handlers in
  `index.html`.
- Headers exercised via `vercel.json` review (runtime verification pending first deploy —
  re-check with `curl -I` post-launch).
- Secret scan: no key material in the repo; `.env*` ignored.

## Recommendations at deploy time

1. Set an OpenAI usage limit on the key used for `OPENAI_API_KEY`.
2. Enable Vercel's rate limiting (or WAF rule) for `/api/chat`.
3. After first deploy, verify headers with `curl -I https://<domain>/` and re-run Lighthouse
   best-practices.
