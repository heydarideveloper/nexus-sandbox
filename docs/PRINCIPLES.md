# Engineering Principles — Nexus Sandbox

Immutable criteria. Every architecture decision, library choice, and feature design is evaluated
against this list; each ADR references the principles it optimizes for and the ones it trades off.

1. **Simplicity over cleverness** — the boring solution wins unless the clever one is measurably better.
2. **Scalability over shortcuts** — content, districts, and AI knowledge must grow without rework.
3. **Security by default** — CSP, secure headers, no secrets in the client, validated inputs at boundaries.
4. **Accessibility by default** — keyboard paths, reduced motion, screen-reader-usable fallback for all content.
5. **Progressive enhancement** — full content available without WebGL; 3D is the enhancement, not the gate.
6. **Mobile-first thinking** — every district works on a phone at 30+ fps or degrades gracefully.
7. **Offline resilience where practical** — static-first architecture; AI degrades to local retrieval.
8. **Performance budgets** — see `docs/PERFORMANCE.md`; budgets are CI-enforced, not aspirational.
9. **Observability from Day 1** — dev FPS/draw-call overlay, error boundaries, web-vitals logging.
10. **Testability** — content model, generators, and retrieval are pure functions with unit tests.
11. **Maintainability** — one content model powers everything; districts are isolated modules.
12. **Documentation-first** — ADRs before code for every major decision.
13. **API-first** — the content model is the API; UI, AI, and resume generation are its consumers.
14. **AI-ready architecture** — all content is structured, chunkable, and embeddable by design.
15. **Vendor lock-in avoidance** — static hosting portable anywhere; only the chat function is Vercel-shaped (one file).
16. **Open standards whenever possible** — plain web platform APIs, glTF-ready pipeline, JSON content.
