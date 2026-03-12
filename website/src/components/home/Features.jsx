import { motion } from 'framer-motion';
import AnimatedSection from '../shared/AnimatedSection';
import SectionHeading from '../shared/SectionHeading';
import Card from '../shared/Card';
import Icon from '../shared/Icon';
import { features } from '../../constants/features';

export default function Features() {
  return (
    <AnimatedSection id="features" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Built for Modern Commerce"
          subtitle="Everything you need to sell on India's open network"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="h-full">
                <div className="w-12 h-12 rounded-lg bg-cerve-primary/10 flex items-center justify-center mb-4">
                  <Icon name={feature.icon} size={24} className="text-cerve-primary" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-cerve-muted leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
