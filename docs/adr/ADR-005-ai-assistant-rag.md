# ADR-005: "Talk with Mohammad" — RAG Architecture

**Decision:** Three-layer degradation:

1. **Local retrieval (always works, offline, free):** deterministic chunking of the content model +
   client-side BM25-style lexical scoring (`src/ai/retrieval.ts`). Answers render as cited evidence
   cards.
2. **LLM generation (when `OPENAI_API_KEY` is configured):** Vercel Edge function `api/chat.ts`
   receives the question + top-k retrieved chunks, calls OpenAI (`gpt-4o-mini`) with a persona
   system prompt and guardrails, streams the answer.
3. **Optional build-time embeddings:** `scripts/build-index.mjs` computes an embeddings index for
   semantic retrieval; when absent, lexical retrieval is used. The pipeline works with zero external
   calls.

**Guardrails (in the system prompt + server checks):**

- Answer only from supplied context; refuse to invent employers, dates, or metrics.
- Speak as Mohammad's documented twin ("Based on my work at Portal.ir…"), never as a generic bot.
- Cite chunk ids; the client renders them as source cards.
- Reject prompt-injection attempts to change persona or leak the system prompt; cap message and
  history sizes at the edge.

**Options considered:**

| Option                                | Advantages                                        | Disadvantages                                                                                  |
| ------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Hosted vector DB (Pinecone/pgvector)  | "Real" infra                                      | A server + credentials for ~100 chunks of static content; lock-in; violates principles #1, #15 |
| Static index + edge function (chosen) | Zero infra, free tier, offline fallback, portable | Re-embeds on content change (seconds)                                                          |
| Client-only LLM calls                 | No server                                         | Leaks API key — unacceptable (principle #3)                                                    |

**Evaluation plan:** `docs/AI-EVALUATION.md` — golden Q/A set, hallucination checks (questions with
no evidence must be declined), retrieval hit-rate on labeled queries, latency target < 2.5 s
first token, cost target < $0.002/conversation.

**Reconsider when:** content outgrows ~1k chunks or multi-turn memory is added (then: pgvector).
