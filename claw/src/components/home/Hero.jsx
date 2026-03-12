import { motion } from 'framer-motion';
import Button from '../shared/Button';
import Icon from '../shared/Icon';

const agentSteps = [
  { type: 'user', text: 'Order butter chicken from Zomato', delay: 0 },
  { type: 'agent', text: 'Opening Zomato...', delay: 0.8 },
  { type: 'agent', text: 'Searching "butter chicken"...', delay: 1.6 },
  { type: 'agent', text: 'Added to cart — ₹349', delay: 2.4 },
  { type: 'safety', text: 'Confirm payment of ₹349?', delay: 3.2 },
  { type: 'user', text: 'Yes, confirm', delay: 4.0 },
  { type: 'success', text: 'Order placed successfully!', delay: 4.6 },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-claw-primary/10 blur-[128px]" style={{ willChange: 'transform' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-claw-secondary/10 blur-[128px]" style={{ willChange: 'transform' }} />
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

          {/* Right: Mobile phone demo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center"
            aria-hidden="true"
          >
            {/* Phone frame */}
            <div className="relative w-64 rounded-[2.5rem] bg-claw-elevated border-2 border-white/20 shadow-2xl glow-primary overflow-hidden"
              style={{ minHeight: 520 }}>
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-claw-elevated rounded-b-2xl z-10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white/20" />
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between px-6 pt-8 pb-2 text-[10px] text-claw-muted font-mono">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <span>●●●</span>
                  <span>WiFi</span>
                  <span>🔋</span>
                </div>
              </div>

              {/* App header */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
                <div className="w-6 h-6 rounded-full bg-claw-primary/20 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-claw-primary">C</span>
                </div>
                <span className="text-xs font-semibold text-claw-text">Claw Agent</span>
                <span className="ml-auto w-2 h-2 rounded-full bg-claw-success animate-pulse" />
              </div>

              {/* Chat messages */}
              <div className="px-3 py-3 space-y-2 overflow-hidden" style={{ minHeight: 360 }}>
                {agentSteps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: step.delay + 0.8 }}
                    className={`flex ${step.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {step.type === 'user' && (
                      <span className="max-w-[75%] px-3 py-1.5 rounded-2xl rounded-br-sm bg-claw-primary text-white text-[11px] leading-snug">
                        {step.text}
                      </span>
                    )}
                    {step.type === 'agent' && (
                      <span className="max-w-[75%] px-3 py-1.5 rounded-2xl rounded-bl-sm bg-claw-card border border-white/10 text-claw-muted text-[11px] leading-snug">
                        {step.text}
                      </span>
                    )}
                    {step.type === 'safety' && (
                      <span className="max-w-[85%] px-3 py-1.5 rounded-2xl rounded-bl-sm bg-yellow-500/10 border border-yellow-400/30 text-yellow-300 text-[11px] leading-snug">
                        ⚠ {step.text}
                      </span>
                    )}
                    {step.type === 'success' && (
                      <span className="max-w-[75%] px-3 py-1.5 rounded-2xl rounded-bl-sm bg-claw-success/10 border border-claw-success/30 text-claw-success text-[11px] leading-snug">
                        ✓ {step.text}
                      </span>
                    )}
                  </motion.div>
                ))}

                {/* Typing indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 6.2 }}
                  className="flex justify-start"
                >
                  <span className="px-3 py-2 rounded-2xl rounded-bl-sm bg-claw-card border border-white/10 text-claw-muted text-[11px] flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-claw-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-claw-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-claw-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </motion.div>
              </div>

              {/* Input bar */}
              <div className="absolute bottom-0 left-0 right-0 px-3 py-3 bg-claw-elevated border-t border-white/5 flex items-center gap-2">
                <div className="flex-1 rounded-full bg-claw-card border border-white/10 px-3 py-1.5 text-[10px] text-claw-muted">
                  Say a command...
                </div>
                <div className="w-7 h-7 rounded-full bg-claw-primary flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Side button decorations */}
            <div className="absolute right-0 top-24 w-1 h-12 rounded-l-sm bg-white/10" style={{ right: 'calc(50% - 136px)' }} />
            <div className="absolute left-0 top-20 w-1 h-8 rounded-r-sm bg-white/10" style={{ left: 'calc(50% - 136px)' }} />
            <div className="absolute left-0 top-32 w-1 h-8 rounded-r-sm bg-white/10" style={{ left: 'calc(50% - 136px)' }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
