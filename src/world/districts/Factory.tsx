import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useScreenClass } from '@/engine/quality';
import { DistrictBody } from './ui';

interface ArchNode {
  id: string;
  label: string;
  x: number; // 0-100 viewBox coords
  y: number;
  color: string;
  detail: string;
}

interface ArchEdge {
  from: string;
  to: string;
  /** seconds for one packet trip */
  duration: number;
  delay?: number;
  color?: string;
}

interface System {
  id: string;
  name: string;
  description: string;
  nodes: ArchNode[];
  edges: ArchEdge[];
}

const SYSTEMS: System[] = [
  {
    id: 'jackpot',
    name: 'Jackpot — real-time game engine',
    description:
      'Server-authoritative by construction: the client renders, the engine decides. Watch spin requests travel the binary WebSocket link, hit the Redis lock, and come back as verified rounds.',
    nodes: [
      {
        id: 'client',
        label: 'React 19 Client',
        x: 8,
        y: 50,
        color: '#22d3ee',
        detail:
          'Zustand-driven UI animating purely from server event streams. No game math lives here — it cannot be tampered with because it does not exist.',
      },
      {
        id: 'ws',
        label: 'Binary WS Codec',
        x: 30,
        y: 50,
        color: '#f59e0b',
        detail:
          'Custom binary protocol shared by client and server: compact frames, GET_ROUND_RESULT state recovery for mid-round reconnects, lightweight heartbeats.',
      },
      {
        id: 'engine',
        label: 'NestJS Engine',
        x: 52,
        y: 50,
        color: '#fb7185',
        detail:
          'The single authority: RNG generation, payline checks, wallet mutations. Load-tested with 10,000 concurrent simulated connections.',
      },
      {
        id: 'redis',
        label: 'Redis Locks',
        x: 74,
        y: 28,
        color: '#34d399',
        detail:
          'Distributed spin-locking around wallet mutations — two concurrent spins can never double-spend a balance.',
      },
      {
        id: 'pg',
        label: 'PostgreSQL',
        x: 74,
        y: 72,
        color: '#818cf8',
        detail:
          'TypeORM-managed persistence for rounds, wallets, and audit history. SQLite in dev for parity.',
      },
    ],
    edges: [
      { from: 'client', to: 'ws', duration: 1.6 },
      { from: 'ws', to: 'engine', duration: 1.6, delay: 0.5 },
      { from: 'engine', to: 'redis', duration: 1.2, delay: 1.0, color: '#34d399' },
      { from: 'engine', to: 'pg', duration: 1.4, delay: 1.2, color: '#818cf8' },
      { from: 'engine', to: 'client', duration: 2.0, delay: 1.8, color: '#facc15' },
    ],
  },
  {
    id: 'portal',
    name: 'Portal.ir — multi-tenant SaaS',
    description:
      '540,000+ users and 10,000+ tenant websites flowing through SSR/ISR caching layers. State isolation and runtime validation cut production errors by ~35%.',
    nodes: [
      {
        id: 'visitors',
        label: '540K+ Users',
        x: 8,
        y: 50,
        color: '#22d3ee',
        detail:
          'Half a million users across ten thousand tenant sites — every one hitting the same frontend architecture.',
      },
      {
        id: 'cdn',
        label: 'CDN / Edge',
        x: 28,
        y: 50,
        color: '#67e8f9',
        detail:
          'Static and ISR-revalidated pages served from the edge; the first line of the caching strategy.',
      },
      {
        id: 'next',
        label: 'Next.js SSR/ISR',
        x: 48,
        y: 50,
        color: '#fb7185',
        detail:
          'Core layout systems and data structures. SSR for freshness, ISR for scale — chosen per route, measured, revisited.',
      },
      {
        id: 'api',
        label: 'API Contracts',
        x: 68,
        y: 28,
        color: '#f59e0b',
        detail:
          'Backend API contracts he defined across teams; runtime validation schemas reject bad data at the boundary.',
      },
      {
        id: 'lifecycle',
        label: 'Site Lifecycle',
        x: 68,
        y: 72,
        color: '#34d399',
        detail:
          'Automated multi-tenant site creation, dynamic app configuration, and lifecycle management workflows.',
      },
      {
        id: 'state',
        label: 'Isolated State',
        x: 88,
        y: 50,
        color: '#c084fc',
        detail:
          'Strict state isolation per tenant flow — the architectural change behind the ~35% production error reduction.',
      },
    ],
    edges: [
      { from: 'visitors', to: 'cdn', duration: 1.5 },
      { from: 'cdn', to: 'next', duration: 1.5, delay: 0.4 },
      { from: 'next', to: 'api', duration: 1.3, delay: 0.9, color: '#f59e0b' },
      { from: 'next', to: 'lifecycle', duration: 1.3, delay: 1.1, color: '#34d399' },
      { from: 'api', to: 'state', duration: 1.2, delay: 1.6, color: '#c084fc' },
      { from: 'lifecycle', to: 'state', duration: 1.2, delay: 1.8, color: '#c084fc' },
    ],
  },
];

/** The architectures are alive: packets travel, queues pulse, every node explains itself. */
export default function Factory() {
  const [systemId, setSystemId] = useState(SYSTEMS[0]!.id);
  const [selected, setSelected] = useState<ArchNode | null>(null);
  const system = useMemo(() => SYSTEMS.find((s) => s.id === systemId)!, [systemId]);
  const compact = useScreenClass() === 'phone';

  return (
    <DistrictBody>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {SYSTEMS.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setSystemId(s.id);
              setSelected(null);
            }}
            className={`touch-target w-full rounded-lg border px-3 py-2.5 text-left text-xs font-semibold transition-colors sm:w-auto sm:py-1.5 ${
              s.id === systemId
                ? 'border-indigo bg-indigo/15 text-ink'
                : 'border-line text-dim hover:text-ink'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>
      <p className="mb-4 text-sm leading-relaxed text-dim">{system.description}</p>

      <div className="glass overflow-x-auto rounded-2xl">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          className="h-[min(58dvh,440px)] min-h-[280px] w-full min-w-[320px]"
          role="img"
          aria-label={`${system.name} live architecture diagram`}
        >
          {/* edges */}
          {system.edges.map((e, i) => {
            const from = system.nodes.find((n) => n.id === e.from)!;
            const to = system.nodes.find((n) => n.id === e.to)!;
            return (
              <g key={i}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="#1c2438"
                  strokeWidth="0.35"
                />
                <motion.circle
                  r="0.8"
                  fill={e.color ?? '#22d3ee'}
                  initial={{ cx: from.x, cy: from.y, opacity: 0 }}
                  animate={{ cx: [from.x, to.x], cy: [from.y, to.y], opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: e.duration,
                    delay: e.delay ?? 0,
                    repeat: Infinity,
                    repeatDelay: 1.2,
                    ease: 'easeInOut',
                  }}
                />
              </g>
            );
          })}
          {/* nodes */}
          {system.nodes.map((n) => (
            <g
              key={n.id}
              onClick={() => setSelected(n)}
              className="cursor-pointer"
              role="button"
              aria-label={`${n.label} — click for detail`}
            >
              <circle cx={n.x} cy={n.y} r="6" fill="transparent" pointerEvents="all" />
              <motion.circle
                cx={n.x}
                cy={n.y}
                r="3.4"
                fill="#0b101d"
                stroke={n.color}
                strokeWidth={selected?.id === n.id ? 0.9 : 0.45}
                animate={{ r: [3.4, 3.7, 3.4] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <circle cx={n.x} cy={n.y} r="1.1" fill={n.color} />
              {!compact && (
                <text
                  x={n.x}
                  y={n.y + 6.4}
                  textAnchor="middle"
                  fill={selected?.id === n.id ? n.color : '#8b98b3'}
                  fontSize="2.5"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {n.label}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="glass mt-3 rounded-xl p-4"
            style={{ borderLeft: `3px solid ${selected.color}` }}
          >
            <h4 className="text-sm font-bold text-ink">{selected.label}</h4>
            <p className="mt-1 text-sm leading-relaxed text-dim">{selected.detail}</p>
          </motion.div>
        )}
        {!selected && (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="terminal-text mt-3 text-center text-[11px] text-dim"
          >
            {compact ? 'tap any node — labels appear below' : 'click any node — every component has a story'}
          </motion.p>
        )}
      </AnimatePresence>
    </DistrictBody>
  );
}
