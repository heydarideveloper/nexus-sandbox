/**
 * Local stand-in for the Vercel Edge runtime.
 *
 * `vite preview`/`vite dev` only serve static files, so /api/chat never runs locally.
 * This script bundles api/chat.ts with esbuild, loads OPENAI_API_KEY from .env, and serves
 * the exact same handler on http://localhost:8787 — vite proxies /api requests to it.
 *
 * Usage: node scripts/dev-api.mjs   (or `npm run dev:api`)
 */
import { build } from 'esbuild';
import { createServer } from 'node:http';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const PORT = 8787;

// Minimal .env loader — only sets vars that aren't already in the environment.
try {
  const env = await readFile(new URL('../.env', import.meta.url), 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
} catch {
  // no .env file — handler will run in retrieval-only mode
}

const dir = await mkdtemp(join(tmpdir(), 'nexus-api-'));
const outfile = join(dir, 'chat.mjs');
await build({
  entryPoints: [new URL('../api/chat.ts', import.meta.url).pathname],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile,
  logLevel: 'silent',
});
const { default: handler } = await import(pathToFileURL(outfile).href);
await rm(dir, { recursive: true, force: true });

const server = createServer(async (req, res) => {
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const request = new Request(`http://localhost:${PORT}${req.url}`, {
      method: req.method,
      headers: req.headers,
      body: chunks.length > 0 ? Buffer.concat(chunks) : undefined,
    });
    const response = await handler(request);
    res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (err) {
    res.writeHead(500, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: String(err) }));
  }
});

server.listen(PORT, () => {
  const keyState = process.env.OPENAI_API_KEY ? 'set — generated answers ON' : 'missing — retrieval-only';
  console.log(`[dev-api] /api/chat ready on http://localhost:${PORT} (OPENAI_API_KEY ${keyState})`);
});
