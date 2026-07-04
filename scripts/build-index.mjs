/**
 * Optional build-time embedding index (ADR-005).
 *
 * With OPENAI_API_KEY set, computes an embedding per RAG chunk and writes
 * public/rag-index.json for semantic retrieval. Without a key it writes a
 * lexical-only marker — the app's BM25 layer works either way, so this script
 * never fails the build.
 *
 * Usage: OPENAI_API_KEY=sk-... npm run build:index
 */
import { build } from 'esbuild';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const EMBEDDING_MODEL = 'text-embedding-3-small';
const OUT_FILE = new URL('../public/rag-index.json', import.meta.url).pathname;

async function loadChunks() {
  const dir = await mkdtemp(join(tmpdir(), 'nexus-chunks-'));
  const outfile = join(dir, 'chunks.mjs');
  await build({
    entryPoints: [new URL('../src/ai/chunks.ts', import.meta.url).pathname],
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile,
    logLevel: 'silent',
  });
  const mod = await import(pathToFileURL(outfile).href);
  await rm(dir, { recursive: true, force: true });
  return mod.buildChunks();
}

async function embed(texts, apiKey) {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: texts }),
  });
  if (!res.ok) throw new Error(`embeddings request failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.data.map((d) => d.embedding);
}

const chunks = await loadChunks();
console.log(`[build-index] ${chunks.length} chunks from the living content model`);

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  await writeFile(
    OUT_FILE,
    JSON.stringify({
      model: null,
      note: 'lexical-only (no OPENAI_API_KEY at build time)',
      chunks: chunks.map((c) => c.id),
    }),
  );
  console.log(
    '[build-index] no OPENAI_API_KEY — wrote lexical-only marker. BM25 retrieval remains fully functional.',
  );
  process.exit(0);
}

const BATCH = 64;
const vectors = [];
for (let i = 0; i < chunks.length; i += BATCH) {
  const batch = chunks.slice(i, i + BATCH);
  const embeddings = await embed(
    batch.map((c) => `${c.title}\n${c.text}`.slice(0, 8000)),
    apiKey,
  );
  vectors.push(...embeddings);
  console.log(`[build-index] embedded ${Math.min(i + BATCH, chunks.length)}/${chunks.length}`);
}

await writeFile(
  OUT_FILE,
  JSON.stringify({
    model: EMBEDDING_MODEL,
    dimensions: vectors[0]?.length ?? 0,
    items: chunks.map((c, i) => ({ id: c.id, title: c.title, vector: vectors[i] })),
  }),
);

const size = (await readFile(OUT_FILE)).byteLength;
console.log(`[build-index] wrote public/rag-index.json (${(size / 1024).toFixed(0)} KB)`);
