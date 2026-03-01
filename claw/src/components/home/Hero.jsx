import { motion } from 'framer-motion';
import Button from '../shared/Button';
import Icon from '../shared/Icon';

const terminalLines = [
  { prompt: '>', text: '"Order butter chicken from Zomato"', delay: 0 },
  { prompt: ' ', text: 'Planning: Open Zomato → Search → Add to cart → Checkout', delay: 0.8 },
  { prompt: ' ', text: 'Opening Zomato...', delay: 1.6 },
  { prompt: ' ', text: 'Searching "butter chicken"...', delay: 2.2 },
  { prompt: '!', text: 'Safety Gate: Confirm payment of ₹349?', delay: 3.0 },
  { prompt: '>', text: '"Yes, confirm"', delay: 3.8 },
  { prompt: '✓', text: 'Order placed successfully!', delay: 4.4 },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-claw-primary/10 blur-[128px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-claw-secondary/10 blur-[128px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-claw-primary/10 text-claw-primary border border-claw-primary/20 mb-6">
                Open Source AI Phone Agent
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight"
            >
              Your Phone,{' '}
              <span className="text-gradient">AI-Powered.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-claw-muted max-w-lg"
            >
              Speak a command. Claw navigates your apps, completes tasks, and stays safe — all hands-free.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Button size="lg" href="https://github.com/AsClaw/CerveAIClaw">
                <Icon name="download" size={20} />
                Download for Android
              </Button>
              <Button size="lg" variant="secondary" to="/how-it-works">
                <Icon name="play" size={20} />
                See How It Works
              </Button>
            </motion.div>
          </div>

          {/* Right: Terminal demo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="rounded-2xl bg-claw-card border border-white/10 overflow-hidden glow-primary">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-claw-elevated border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-claw-muted font-mono">claw-agent</span>
              </div>

              {/* Terminal body */}
              <div className="p-5 font-mono text-sm space-y-2 min-h-[280px]">
                {terminalLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: line.delay + 0.8 }}
                    className="flex gap-2"
                  >
                    <span
                      className={
                        line.prompt === '>'
                          ? 'text-claw-secondary'
                          : line.prompt === '!'
                          ? 'text-yellow-400'
                          : line.prompt === '✓'
                          ? 'text-claw-success'
                          : 'text-claw-muted'
                      }
                    >
                      {line.prompt}
                    </span>
                    <span
                      className={
                        line.prompt === '>'
                          ? 'text-claw-text'
                          : line.prompt === '!'
                          ? 'text-yellow-300'
                          : line.prompt === '✓'
                          ? 'text-claw-success'
                          : 'text-claw-muted'
                      }
                    >
                      {line.text}
                    </span>
                  </motion.div>
                ))}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 6 }}
                  className="inline-block w-2 h-4 bg-claw-secondary mt-2"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
