import { describe, expect, it } from 'vitest';
import { buildChunks } from './chunks';
import { isAnswerable, retrieve, tokenize } from './retrieval';

describe('RAG chunking', () => {
  it('builds a chunk for every content entity', () => {
    const chunks = buildChunks();
    // 1 profile + 7 experiences + 6 projects + 25 skills + 5 learning + 8 achievements + 6 automations + 6 experiments + 5 notes
    expect(chunks.length).toBeGreaterThanOrEqual(60);
    for (const c of chunks) {
      expect(c.text.length).toBeGreaterThan(30);
      expect(c.sourceRefs.length).toBeGreaterThan(0);
    }
  });

  it('is deterministic', () => {
    expect(buildChunks()).toEqual(buildChunks());
  });
});

describe('BM25 retrieval — golden question set (docs/AI-EVALUATION.md)', () => {
  const golden: [string, string][] = [
    ['Tell me about Portal', 'experience:portal'],
    ['How does he prevent cheating in the slot game?', 'project:jackpot'],
    ['What is his experience with telemedicine?', 'experience:pezeshket'],
    ['Does he know React Native?', 'skill:react-native'],
    ['What is he currently learning about vector databases?', 'learning:vectordb'],
    ['Explain the banking risk engine architecture', 'project:risk-engine'],
    ['What was Reqo?', 'project:reqo'],
    ['How does he approach leadership?', 'skill:leadership'],
    ['What is FSRS spaced repetition in VoKaN?', 'experiment:fsrs-model'],
    ['binary websocket protocol codec', 'experiment:binary-protocol'],
  ];

  for (const [query, expectedId] of golden) {
    it(`"${query}" retrieves ${expectedId} in top 3`, () => {
      const results = retrieve(query, 3);
      expect(results.map((r) => r.chunk.id)).toContain(expectedId);
    });
  }

  it('hit rate across the golden set is 100% at k=3', () => {
    const hits = golden.filter(([q, id]) => retrieve(q, 3).some((r) => r.chunk.id === id));
    expect(hits.length).toBe(golden.length);
  });
});

describe('hallucination guardrails — must refuse', () => {
  const unanswerable = [
    'What is his experience with COBOL mainframes?',
    'Tell me about his PhD thesis',
    'What Formula 1 team does he drive for?',
  ];

  for (const q of unanswerable) {
    it(`declines "${q}"`, () => {
      expect(isAnswerable(retrieve(q, 5), q)).toBe(false);
    });
  }

  it('accepts well-evidenced questions', () => {
    const q = 'React Next.js SaaS 540000 users';
    expect(isAnswerable(retrieve(q, 5), q)).toBe(true);
  });

  it('accepts single-entity questions like "Tell me about Portal"', () => {
    const q = 'Tell me about Portal';
    expect(isAnswerable(retrieve(q, 5), q)).toBe(true);
  });
});

describe('tokenizer', () => {
  it('keeps technical tokens like c# and node.js-ish terms', () => {
    expect(tokenize('React 19 + Vite, WebSockets!')).toEqual(['react', '19', 'vite', 'websockets']);
  });
});
