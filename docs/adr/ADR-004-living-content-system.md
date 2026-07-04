# ADR-004: Living Content System

**Decision:** All facts live in `src/content/` as TypeScript data validated by zod schemas
(`src/content/schema.ts`). Consumers: district UIs, the knowledge graph, achievements, the RAG
chunker, and the resume generator. Nothing renders a fact that is not in the model.

**Context:** Spec sections "Living Content System", "Digital Twin Architecture", and the personal
context injection ("never generate generic content") require one source of truth with provenance.

**Schema highlights:**

- Every entity carries `sourceRefs: string[]` pointing at evidence files (e.g. `resume/resume.tex`).
- `SkillNode.status: 'expert' | 'advanced' | 'working' | 'learning'` renders honest levels — the
  learning items are the Learning Observatory's data.
- `chunkText()` in `src/ai/chunks.ts` deterministically flattens the model into RAG chunks with
  metadata (`kind`, `id`, `title`) so one content edit updates UI + AI + resume simultaneously.

**Options considered:** external CMS (rejected: vendor lock-in, an API for one author), markdown
files + frontmatter (rejected: loses type safety across 10 consumers), TS-in-repo (chosen: typed,
tested, diffable, zero runtime cost).

**Reconsider when:** non-engineer editing is needed, or content updates should not require deploys
(evolution stage 6: move model to a headless store, keep schemas).
