import AnimatedSection from '../shared/AnimatedSection';
import SectionHeading from '../shared/SectionHeading';
import Card from '../shared/Card';
import Icon from '../shared/Icon';

const protections = [
  {
    icon: 'shield',
    title: 'Financial Protection',
    description: 'All payment actions require explicit user confirmation. No auto-purchasing, no surprise charges.',
    color: 'text-claw-primary',
  },
  {
    icon: 'mic',
    title: 'Communication Guard',
    description: 'Calls, messages, and emails are never sent without your approval. Review before it goes out.',
    color: 'text-claw-secondary',
  },
  {
    icon: 'lock',
    title: 'Destructive Action Block',
    description: 'Deletions, uninstalls, and permission changes are always gated. Undo-proof by design.',
    color: 'text-yellow-400',
  },
  {
    icon: 'eye',
    title: 'Prompt Injection Defense',
    description: 'ScreenContentSanitizer strips malicious instructions from screen content before AI processing.',
    color: 'text-claw-success',
  },
];

export default function Safety() {
  return (
    <AnimatedSection className="py-24 px-4 sm:px-6 lg:px-8" id="safety">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Safety is Non-Negotiable"
          subtitle="Every sensitive action requires your explicit approval. No exceptions."
        />

        <div className="grid gap-6 sm:grid-cols-2">
          {protections.map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 0.1}>
              <Card className="h-full flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-claw-elevated flex items-center justify-center">
                    <Icon name={item.icon} size={24} className={item.color} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-claw-muted leading-relaxed">{item.description}</p>
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.4}>
          <div className="mt-12 rounded-2xl bg-claw-card border border-white/10 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-claw-success/10 mb-4">
              <Icon name="device" size={32} className="text-claw-success" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Your Data Stays on Your Device</h3>
            <p className="text-claw-muted max-w-lg mx-auto">
              Screen content is processed locally. On-device LLMs keep everything private.
              Cloud models only receive the minimum context needed — and you choose which model to use.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </AnimatedSection>
  );
}
