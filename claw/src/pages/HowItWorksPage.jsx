import { motion } from 'framer-motion';
import AnimatedSection from '../components/shared/AnimatedSection';
import SectionHeading from '../components/shared/SectionHeading';
import Card from '../components/shared/Card';
import Icon from '../components/shared/Icon';
import CTA from '../components/home/CTA';

const pipeline = [
  {
    stage: 'User Input',
    icon: 'mic',
    color: 'text-claw-secondary',
    description: 'Voice or text command is captured and processed.',
    details: [
      'Speech-to-text via Sarvam or Google STT',
      'Natural language understanding',
      'Intent and entity extraction',
    ],
  },
  {
    stage: 'Task Planner',
    icon: 'brain',
    color: 'text-claw-primary',
    description: 'The LLM breaks your command into a sequence of executable steps.',
    details: [
      'Multi-step task decomposition',
      'App identification and routing',
      'Parameter extraction from context',
    ],
  },
  {
    stage: 'Agent Loop',
    icon: 'route',
    color: 'text-yellow-400',
    description: 'The agent iterates through steps, observing screen state after each action.',
    details: [
      'Screen content analysis via AccessibilityService',
      'Element identification and targeting',
      'Dynamic replanning when UI changes',
    ],
  },
  {
    stage: 'Safety Gate',
    icon: 'shield',
    color: 'text-claw-danger',
    description: 'Before sensitive actions, the Safety Gate pauses and requests confirmation.',
    details: [
      'Financial transaction detection',
      'Communication action interception',
      'Destructive operation blocking',
      'ScreenContentSanitizer for prompt injection defense',
    ],
  },
  {
    stage: 'UI Action Executor',
    icon: 'pointer',
    color: 'text-claw-success',
    description: 'Approved actions are executed on the device via AccessibilityService.',
    details: [
      'Tap, type, scroll, press operations',
      'Wait-and-verify after each action',
      'Error detection and recovery',
    ],
  },
  {
    stage: 'Result',
    icon: 'check',
    color: 'text-claw-success',
    description: 'Task completion is verified and reported to the user.',
    details: [
      'Success/failure detection',
      'Completion notification',
      'Execution log available for review',
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="pt-24">
      <AnimatedSection className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient mb-6">
            How Claw Works
          </h1>
          <p className="text-lg text-claw-muted max-w-2xl mx-auto">
            From your voice command to task completion — here's the full pipeline.
          </p>
        </div>
      </AnimatedSection>

      {/* Pipeline */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-0">
          {pipeline.map((step, i) => (
            <AnimatedSection key={step.stage} delay={i * 0.1}>
              <div className="relative flex gap-6">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <motion.div
                    whileInView={{ scale: [0, 1] }}
                    viewport={{ once: true }}
                    className={`w-12 h-12 rounded-full bg-claw-elevated border-2 border-white/10 flex items-center justify-center flex-shrink-0 z-10`}
                  >
                    <Icon name={step.icon} size={20} className={step.color} />
                  </motion.div>
                  {i < pipeline.length - 1 && (
                    <div className="w-px h-full bg-gradient-to-b from-white/10 to-transparent min-h-[40px]" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-10">
                  <h3 className="text-lg font-bold text-white mb-1">{step.stage}</h3>
                  <p className="text-sm text-claw-muted mb-3">{step.description}</p>
                  <ul className="space-y-1">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2 text-xs text-claw-muted">
                        <span className="text-claw-primary mt-0.5">-</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Architecture overview */}
      <AnimatedSection className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            title="Architecture Overview"
            subtitle="Key components that make Claw work."
          />
          <div className="rounded-2xl bg-claw-card border border-white/10 p-6 sm:p-8 font-mono text-sm">
            <pre className="text-claw-muted overflow-x-auto leading-loose">
{`┌─────────────────────────────────────────────┐
│                  User Input                  │
│            (Voice / Text Command)            │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│              LLM Task Planner               │
│     (Gemini / Sarvam / Claude / Local)      │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│              Agent Loop                      │
│    ┌──────────┐    ┌─────────────────┐      │
│    │ Observe  │───▶│ Plan Next Step  │      │
│    │  Screen  │    └────────┬────────┘      │
│    └──────────┘             │               │
│                             ▼               │
│              ┌──────────────────────┐       │
│              │    Safety Gate       │       │
│              │  (Confirm if risky)  │       │
│              └──────────┬───────────┘       │
│                         │                   │
│                         ▼                   │
│              ┌──────────────────────┐       │
│              │  Execute UI Action   │       │
│              │ (AccessibilityService)│       │
│              └──────────────────────┘       │
└─────────────────────────────────────────────┘`}
            </pre>
          </div>
        </div>
      </AnimatedSection>

      <CTA />
    </div>
  );
}
