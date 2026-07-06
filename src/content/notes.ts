import type { EngineeringNote } from './schema';

const CANONICAL = ['resume/resume.tex', 'resume/MOHAMMAD_HEYDARI_Full (1).pdf'];
const PROFILE = ['docs/PROFILE.md'];

/** Hidden-terminal "Engineering Notes" — trade-offs, mistakes, lessons. Exactly 5 (one per terminal). */
export const engineeringNotes: EngineeringNote[] = [
  {
    id: 'note-authority',
    title: 'Where Authority Lives',
    kind: 'trade-off',
    body: 'In Jackpot I gave the server everything: RNG, paylines, wallets. The cost is real — every animation waits on a round-trip, reconnection needs protocol-level state recovery, and the frontend becomes a renderer of someone else\u2019s truth. I paid it anyway, because in systems where state is money, "trust the client a little" is not a trade-off, it\u2019s a countdown. The binary codec exists to make that round-trip cheap enough to feel instant.',
    sourceRefs: CANONICAL,
  },
  {
    id: 'note-errors',
    title: 'The 35% Was Architecture, Not Bug-Fixing',
    kind: 'lesson',
    body: 'At Portal.ir we cut production errors by about a third — not by fixing bugs faster, but by making categories of bugs impossible: state isolation so tenants can\u2019t bleed into each other, runtime validation schemas so bad data dies at the door, decoupled routing so navigation can\u2019t corrupt state. When an error rate drops that much, you didn\u2019t debug better. You redesigned.',
    sourceRefs: CANONICAL,
  },
  {
    id: 'note-crash',
    title: 'Race Conditions Are a Design Problem',
    kind: 'philosophy',
    body: 'In Jackpot, two concurrent spins on the same wallet are not a bug to patch later — they are a constraint to design against from day one. Redis distributed spin-locks around wallet mutations mean a second spin waits instead of double-spending. The protocol, the lock, and the server-authoritative engine had to agree on what "one spin" means. When money moves in real time, optimistic concurrency is optimism you cannot afford.',
    sourceRefs: CANONICAL,
  },
  {
    id: 'note-shared-core',
    title: 'One Core, Three Platforms, Real Costs',
    kind: 'trade-off',
    body: 'At Septa Pay I built one JavaScript core shared by web, mobile, and desktop. It worked — releases synchronized, business logic stopped diverging. But honesty about the cost: platform-specific edge cases leaked upward, the abstraction layer needed constant defense, and debugging crossed three runtimes. A shared core is a leadership commitment, not a code decision. I\u2019d do it again — for a team that agrees to maintain the discipline.',
    sourceRefs: CANONICAL,
  },
  {
    id: 'note-learning',
    title: 'Ship Your Ignorance',
    kind: 'lesson',
    body: 'This site is built on things I was not expert in when I started it: Three.js, RAG, embeddings. The old instinct is to hide that; the better move is to make the learning itself the product. The Learning Observatory shows real progress bars — 45%, 40%, 30% — because a senior engineer who documents what they don\u2019t know yet is more credible than one who claims everything. The FSRS work in VoKaN taught me this: learning is a schedulable, measurable system. So schedule it.',
    sourceRefs: PROFILE,
  },
];
