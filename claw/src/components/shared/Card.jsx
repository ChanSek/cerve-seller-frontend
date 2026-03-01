import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true, gradient = false }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      className={`rounded-xl bg-claw-card p-6 transition-all duration-300 ${
        gradient ? 'border-gradient' : 'border border-white/5 hover:border-claw-primary/30'
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
