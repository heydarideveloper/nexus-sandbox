# ADR-001: Single Vite App with Module Boundaries, Not a Monorepo

**Decision:** Build one Vite application with path-aliased internal modules (`@/content`,
`@/world`, `@/shell`, `@/ai`, `@/state`, `@/resume`, `@/fallback`, `@/lib`) instead of the
`apps/ + packages/` monorepo suggested in the spec.

**Context:** The spec proposes a Turborepo-style layout (`packages/engine`, `packages/renderer`,
…). The project has exactly one deployable (the web app), one author, and no package consumers.

**Problem:** How to get the spec's separation-of-concerns without paying monorepo overhead.

**Options considered:**

| Option                          | Advantages                                                          | Disadvantages                                                                           | Cost       | Maintenance | Risk                                   |
| ------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ---------- | ----------- | -------------------------------------- |
| A. pnpm/turborepo monorepo      | Matches spec text; future extraction free                           | Workspace config, versioning, build orchestration, slower CI, no second consumer exists | High setup | High        | Over-engineering for 1 app             |
| B. Single app + aliased modules | Same boundaries via folder discipline + lint; one build; trivial CI | Boundaries are conventions, not package walls                                           | Minimal    | Low         | Boundary erosion (mitigated by review) |

**Decision taken:** Option B.
**Reason:** Principles #1 (simplicity) and #11 (maintainability). The spec's real requirement is
"independent feature systems rather than page-based modules" — folder-level module boundaries
satisfy that. A monorepo with one package consumer violates YAGNI.
**Reconsider when:** a second deployable appears (e.g. a published `@nexus/engine` package or a
native app), or module boundaries are repeatedly violated in practice.
