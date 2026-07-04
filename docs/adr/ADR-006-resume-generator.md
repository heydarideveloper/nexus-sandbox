# ADR-006: Dynamic Resume Generator

**Decision:** Audience presets (Startup / Enterprise / AI Company / Frontend / System Design /
Leadership) are pure functions over the content model: each preset defines section ordering,
bullet weighting (every experience bullet is tagged with facets), and summary emphasis. Rendering
is a print-optimized DOM (`@media print` CSS) exported via the browser's native print-to-PDF.
Optional LLM polish of the summary line when the API key exists — never of facts.

**Options considered:**

| Option                                | Advantages                                                             | Disadvantages                                                            |
| ------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Print CSS (chosen)                    | Zero deps, pixel-controlled, works offline, testable as pure functions | Browser print dialog UX                                                  |
| Client PDF lib (pdfmake/react-pdf)    | Direct .pdf download                                                   | +200–400 KB bundle for output identical to print CSS; violates JS budget |
| Server-side LaTeX (his real pipeline) | Matches source resumes                                                 | Requires a TeX server; violates principle #1                             |
| Full LLM generation                   | "AI resume" marketing                                                  | Hallucination risk on facts — violates "never invent achievements"       |

**Reason:** Facts must be deterministic and testable (principle #10); presentation is the only
variable. The preset selection logic is unit-tested: every preset must include the identity header,
at least 3 experiences, and only bullets whose facets match.

**Reconsider when:** users need ATS-parseable .docx output (add a docx serializer over the same
preset output).
