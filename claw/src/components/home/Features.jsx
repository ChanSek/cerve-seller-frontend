import AnimatedSection from '../shared/AnimatedSection';
import SectionHeading from '../shared/SectionHeading';
import Card from '../shared/Card';
import Icon from '../shared/Icon';
import { features } from '../../constants/features';

export default function Features() {
  return (
    <AnimatedSection className="py-24 px-4 sm:px-6 lg:px-8" id="features">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Powerful by Design"
          subtitle="Built with intelligence, safety, and extensibility at its core."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <AnimatedSection key={feature.title} delay={i * 0.1}>
              <Card className="h-full">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-claw-primary/10">
                  <Icon name={feature.icon} size={24} className="text-claw-primary" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-claw-muted leading-relaxed">{feature.description}</p>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
