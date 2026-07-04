import { useCallback, useState } from 'react';
import { isAnswerable, retrieve } from './retrieval';

export interface Citation {
  id: string;
  title: string;
}

export interface ChatMessage {
  role: 'user' | 'twin';
  text: string;
  citations?: Citation[];
  /** Evidence cards shown when generation is unavailable (retrieval-only mode). */
  evidence?: { id: string; title: string; text: string }[];
}

interface ApiResponse {
  answer: string | null;
  citations?: Citation[];
  evidence?: { id: string; title: string; text: string }[];
  mode?: string;
  error?: string;
}

const REFUSAL =
  "I don't have documented evidence for that one. Ask me about my career (Portal.ir, Pezeshket, Septa Pay…), my projects (Jackpot, VoKaN…), my skills, or what I'm learning.";

/**
 * Three-layer degradation (ADR-005): edge LLM → edge retrieval-only → fully local retrieval.
 * The twin works offline and without any API key.
 */
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);

  const ask = useCallback(async (rawQuestion: string) => {
    const question = rawQuestion.trim().slice(0, 500);
    if (!question) return;
    setMessages((m) => [...m, { role: 'user', text: question }]);
    setBusy(true);

    const reply = await getReply(question);
    setMessages((m) => [...m, reply]);
    setBusy(false);
  }, []);

  return { messages, busy, ask };
}

async function getReply(question: string): Promise<ChatMessage> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    if (res.ok) {
      const data = (await res.json()) as ApiResponse;
      if (data.answer) {
        return { role: 'twin', text: data.answer, citations: data.citations };
      }
      if (data.evidence?.length) {
        return {
          role: 'twin',
          text: 'Generation is offline right now, but here is the documented evidence that answers your question:',
          citations: data.citations,
          evidence: data.evidence,
        };
      }
      if (data.mode === 'refused') {
        return { role: 'twin', text: REFUSAL };
      }
    }
  } catch {
    // fall through to local retrieval
  }
  return localReply(question);
}

/** Fully offline answer: local BM25 over the shipped chunks. */
function localReply(question: string): ChatMessage {
  const results = retrieve(question, 3);
  if (!isAnswerable(results, question)) {
    return { role: 'twin', text: REFUSAL };
  }
  return {
    role: 'twin',
    text: 'The AI service is unreachable, so here is the raw evidence from my knowledge base:',
    citations: results.map((r) => ({ id: r.chunk.id, title: r.chunk.title })),
    evidence: results.map((r) => ({ id: r.chunk.id, title: r.chunk.title, text: r.chunk.text })),
  };
}
