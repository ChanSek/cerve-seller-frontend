import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../shared/AnimatedSection';
import SectionHeading from '../shared/SectionHeading';
import Icon from '../shared/Icon';
import { faqItems } from '../../constants/faq';

const FAQItem = memo(function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className={`text-base font-medium ${isOpen ? 'text-white' : 'text-claw-text'}`}>
          {item.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 ml-4"
        >
          <Icon name="chevronDown" size={20} className="text-claw-muted" />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-claw-muted leading-relaxed">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default function FAQ({ limit = 6 }) {
  const [openIndex, setOpenIndex] = useState(null);
  const items = limit ? faqItems.slice(0, limit) : faqItems;

  return (
    <AnimatedSection className="py-24 px-4 sm:px-6 lg:px-8" id="faq">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about Claw."
        />

        <div className="rounded-2xl bg-claw-card border border-white/10 px-6">
          {items.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
