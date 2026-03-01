import AnimatedSection from '../shared/AnimatedSection';
import SectionHeading from '../shared/SectionHeading';
import Card from '../shared/Card';
import Icon from '../shared/Icon';

const demos = [
  {
    title: 'Order Food from Zomato',
    description: '"Order butter chicken from the nearest restaurant"',
    steps: ['Opens Zomato', 'Searches for butter chicken', 'Selects top-rated option', 'Adds to cart', 'Asks confirmation before payment'],
    icon: 'grid',
  },
  {
    title: 'Send a WhatsApp Message',
    description: '"Send Mom a message saying I\'ll be home by 8"',
    steps: ['Opens WhatsApp', 'Finds "Mom" in contacts', 'Types the message', 'Sends automatically'],
    icon: 'keyboard',
  },
  {
    title: 'Toggle System Settings',
    description: '"Turn off Wi-Fi and enable Bluetooth"',
    steps: ['Opens Settings', 'Navigates to Wi-Fi', 'Toggles Wi-Fi off', 'Navigates to Bluetooth', 'Toggles Bluetooth on'],
    icon: 'toggle',
  },
];

export default function Demo() {
  return (
    <AnimatedSection className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="See Claw in Action"
          subtitle="Real tasks, autonomously completed."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {demos.map((demo, i) => (
            <AnimatedSection key={demo.title} delay={i * 0.1}>
              <Card className="h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-claw-primary/10 flex items-center justify-center">
                    <Icon name={demo.icon} size={20} className="text-claw-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{demo.title}</h3>
                </div>

                <p className="text-sm text-claw-secondary font-mono mb-4">{demo.description}</p>

                {/* Step visualization */}
                <div className="space-y-2">
                  {demo.steps.map((step, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <span className="mt-1 w-5 h-5 rounded-full bg-claw-elevated flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] text-claw-muted font-mono">{j + 1}</span>
                      </span>
                      <span className="text-sm text-claw-muted">{step}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
