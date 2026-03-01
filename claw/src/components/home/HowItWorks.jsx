import { motion } from 'framer-motion';
import AnimatedSection from '../shared/AnimatedSection';
import SectionHeading from '../shared/SectionHeading';
import Icon from '../shared/Icon';

const steps = [
  {
    number: '01',
    icon: 'mic',
    title: 'Speak or Type',
    description: 'Give a natural language command — voice or text. "Order food from Zomato" or "Send a WhatsApp message to Mom."',
    color: 'text-claw-primary',
    bg: 'bg-claw-primary/10',
  },
  {
    number: '02',
    icon: 'brain',
    title: 'Claw Plans & Executes',
    description: 'The AI breaks your command into steps, navigates apps, taps buttons, fills forms — autonomously handling the workflow.',
    color: 'text-claw-secondary',
    bg: 'bg-claw-secondary/10',
  },
  {
    number: '03',
    icon: 'shield',
    title: 'Confirms Before Acting',
    description: 'Before payments, calls, or destructive actions, Claw pauses and asks for your explicit confirmation. You stay in control.',
    color: 'text-claw-success',
    bg: 'bg-claw-success/10',
  },
];

export default function HowItWorks() {
  return (
    <AnimatedSection className="py-24 px-4 sm:px-6 lg:px-8" id="how-it-works">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="How It Works"
          subtitle="Three simple steps from command to completion."
        />

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <AnimatedSection key={step.number} delay={i * 0.15}>
              <div className="relative text-center">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-white/10 to-white/5" />
                )}

                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-2xl ${step.bg} mb-6`}>
                  <Icon name={step.icon} size={40} className={step.color} />
                </div>

                <motion.span
                  className="block text-5xl font-extrabold text-white/5 mb-2"
                  whileInView={{ opacity: [0, 1] }}
                  viewport={{ once: true }}
                >
                  {step.number}
                </motion.span>

                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-claw-muted leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
