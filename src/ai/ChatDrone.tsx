import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useWorld } from '@/state/world';
import { useChat } from './useChat';
import { sfx } from '@/audio/engine';

const SUGGESTIONS = [
  'Tell me about Portal.ir',
  'How does the Jackpot engine prevent cheating?',
  'Would he fit a startup?',
  'How does he approach system design?',
  'What is he learning right now?',
];

/** The drone companion: "Talk with Mohammad" — grounded in evidence, honest about limits. */
export default function ChatDrone() {
  const setChatOpen = useWorld((s) => s.setChatOpen);
  const { messages, busy, ask } = useChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (q: string) => {
    if (busy || !q.trim()) return;
    sfx.open();
    void ask(q);
    setInput('');
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass no-print fixed top-16 right-3 bottom-16 z-40 flex w-[min(94vw,24rem)] flex-col overflow-hidden rounded-2xl border-t-2 border-t-neon"
      role="dialog"
      aria-label="Talk with Mohammad's digital twin"
    >
      <header className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-2.5">
          <motion.div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-neon/15 text-lg"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          >
            🛸
          </motion.div>
          <div>
            <div className="text-sm font-bold text-ink">Talk with Mohammad</div>
            <div className="terminal-text text-[10px] text-dim">
              digital twin · answers only from evidence
            </div>
          </div>
        </div>
        <button
          className="rounded-lg border border-line px-2.5 py-1 text-xs text-dim hover:border-rose hover:text-rose"
          onClick={() => {
            sfx.close();
            setChatOpen(false);
          }}
          aria-label="Close chat"
        >
          ✕
        </button>
      </header>

      <div ref={scrollRef} className="district-scroll flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div>
            <p className="text-sm text-dim">
              Ask me anything about my career, systems, or learning. If I don't have evidence, I'll
              say so instead of making it up.
            </p>
            <div className="mt-3 flex flex-col gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="terminal-text rounded-lg border border-line px-3 py-1.5 text-left text-[11px] text-dim transition-colors hover:border-neon hover:text-neon"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div
              className={`max-w-[88%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-neon/15 text-ink'
                  : 'border border-line bg-panel text-ink/90'
              }`}
            >
              {m.text}
              {m.evidence && (
                <div className="mt-2 space-y-2">
                  {m.evidence.map((e) => (
                    <div key={e.id} className="rounded-lg border border-line bg-void/60 p-2">
                      <div className="terminal-text text-[10px] font-bold text-neon">{e.title}</div>
                      <p className="mt-1 line-clamp-4 text-[11px] text-dim">{e.text}</p>
                    </div>
                  ))}
                </div>
              )}
              {m.citations && m.citations.length > 0 && !m.evidence && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {m.citations.map((c) => (
                    <span
                      key={c.id}
                      className="terminal-text rounded border border-line px-1.5 py-0.5 text-[9px] text-dim"
                      title={c.title}
                    >
                      {c.id}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {busy && (
          <div className="flex justify-start">
            <div className="terminal-text rounded-xl border border-line bg-panel px-3 py-2 text-xs text-dim">
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              >
                retrieving evidence…
              </motion.span>
            </div>
          </div>
        )}
      </div>

      <form
        className="flex gap-2 border-t border-line p-3"
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={500}
          placeholder="Ask the twin…"
          aria-label="Your question"
          className="min-w-0 flex-1 rounded-lg border border-line bg-void px-3 py-2 text-sm text-ink placeholder:text-dim focus:border-neon focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="rounded-lg bg-neon px-4 py-2 text-sm font-bold text-void transition-colors enabled:hover:bg-neon/80 disabled:opacity-40"
        >
          ask
        </button>
      </form>
    </motion.aside>
  );
}
