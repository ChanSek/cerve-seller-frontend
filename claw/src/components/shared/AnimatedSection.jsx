import { memo } from 'react';
import { motion } from 'framer-motion';

const AnimatedSection = memo(function AnimatedSection({ children, className = '', delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  );
});

export default AnimatedSection;
