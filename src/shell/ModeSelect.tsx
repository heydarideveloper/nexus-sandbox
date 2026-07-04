import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useWorld } from '@/state/world';
import { content } from '@/content';
import { rise } from '@/lib/motion';

export function ModeSelect() {
  const chooseMode = useWorld((s) => s.chooseMode);

  return (
    <motion.div
      className="flex h-full flex-col items-center justify-center gap-10 px-6 text-center"
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <motion.div variants={rise} custom={0}>
        <p className="terminal-text mb-3 text-xs tracking-[0.3em] text-neon uppercase">
          connection established
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-6xl">
          {content.profile.name}
        </h1>
        <p className="mt-3 max-w-xl text-sm text-dim sm:text-base">
          You are connected to a live digital twin — {content.profile.headline.toLowerCase()},
          rendered as an explorable world. Choose how you want to enter.
        </p>
      </motion.div>

      <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
        <motion.button
          variants={rise}
          custom={1}
          onClick={() => chooseMode('guided')}
          className="glass pulse-glow group rounded-2xl p-6 text-left transition-transform hover:-translate-y-1"
        >
          <div className="terminal-text text-xs text-neon uppercase">guided tour · 5–8 min</div>
          <div className="mt-2 text-xl font-bold text-ink">Recruiter Mode</div>
          <p className="mt-2 text-sm text-dim">
            A drone companion flies you through every district in order — career, systems, AI,
            proof. Ideal if your time is billed in minutes.
          </p>
        </motion.button>

        <motion.button
          variants={rise}
          custom={2}
          onClick={() => chooseMode('explorer')}
          className="glass group rounded-2xl p-6 text-left transition-transform hover:-translate-y-1"
        >
          <div className="terminal-text text-xs text-violet uppercase">
            explorer mode · no rails
          </div>
          <div className="mt-2 text-xl font-bold text-ink">Free Roam</div>
          <p className="mt-2 text-sm text-dim">
            Walk the world yourself. Five hidden terminals hold engineering notes for the curious —
            trade-offs, mistakes, lessons.
          </p>
        </motion.button>
      </div>

      <motion.div variants={rise} custom={3} className="text-xs text-dim">
        Prefer plain text?{' '}
        <Link to="/os" className="text-neon underline underline-offset-4">
          Open the accessible OS view
        </Link>{' '}
        — same content, zero WebGL.
      </motion.div>
    </motion.div>
  );
}
