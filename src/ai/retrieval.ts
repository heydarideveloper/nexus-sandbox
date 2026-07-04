import { chunks, type Chunk } from './chunks';

export interface ScoredChunk {
  chunk: Chunk;
  score: number;
  /** Number of distinct query terms that matched this chunk. */
  matched: number;
}

const STOPWORDS = new Set(
  'a an and are as at be but by for from has have he his how i in is it its me my of on or she that the their them they this to was we what when where which who why with you your does did about tell know explain experience'.split(
    ' ',
  ),
);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#\s-]/g, ' ') // "portal.ir" → "portal ir", "node.js" → "node js" (consistent both sides)
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

interface IndexedChunk {
  chunk: Chunk;
  tf: Map<string, number>;
  titleTerms: Set<string>;
  length: number;
}

/** BM25 over the deterministic chunks — the always-available retrieval layer (ADR-005). */
class Bm25Index {
  private docs: IndexedChunk[];
  private df = new Map<string, number>();
  private avgLength = 0;
  private k1 = 1.4;
  private b = 0.75;

  constructor(source: Chunk[]) {
    this.docs = source.map((chunk) => {
      const tokens = tokenize(`${chunk.title} ${chunk.title} ${chunk.text}`);
      const tf = new Map<string, number>();
      for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
      return { chunk, tf, titleTerms: new Set(tokenize(chunk.title)), length: tokens.length };
    });
    for (const d of this.docs) {
      for (const term of d.tf.keys()) this.df.set(term, (this.df.get(term) ?? 0) + 1);
    }
    this.avgLength = this.docs.reduce((a, d) => a + d.length, 0) / Math.max(1, this.docs.length);
  }

  search(query: string, k = 5): ScoredChunk[] {
    const terms = [...new Set(tokenize(query))];
    const n = this.docs.length;
    const scored = this.docs.map((d) => {
      let score = 0;
      let matched = 0;
      for (const term of terms) {
        const tf = d.tf.get(term) ?? 0;
        if (tf === 0) continue;
        matched += 1;
        const df = this.df.get(term) ?? 0;
        const idf = Math.log(1 + (n - df + 0.5) / (df + 0.5));
        score +=
          (idf * tf * (this.k1 + 1)) /
          (tf + this.k1 * (1 - this.b + (this.b * d.length) / this.avgLength));
        // Entity questions ("Tell me about Portal") should land on the entity's own chunk,
        // not on a short chunk that merely mentions it — reward title hits.
        if (d.titleTerms.has(term)) score += 2.2 * idf;
      }
      return { chunk: d.chunk, score, matched };
    });
    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  }
}

let index: Bm25Index | null = null;

export function retrieve(query: string, k = 5): ScoredChunk[] {
  index ??= new Bm25Index(chunks);
  return index.search(query, k);
}

/**
 * Confidence gate (hallucination guardrail, calibrated in docs/AI-EVALUATION.md):
 * the top chunk must cover at least half of the query's content terms — one incidental
 * word ("team", "users") hitting a big chunk is not evidence, no matter its BM25 score.
 */
export function isAnswerable(results: ScoredChunk[], query?: string): boolean {
  const top = results[0];
  if (!top || top.score < 2) return false;
  if (query === undefined) return top.score >= 4 || top.matched >= 2;
  const termCount = new Set(tokenize(query)).size;
  if (termCount === 0) return false;
  return top.matched / termCount >= 0.5;
}
