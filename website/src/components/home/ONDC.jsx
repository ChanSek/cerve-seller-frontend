import { motion } from 'framer-motion';
import AnimatedSection from '../shared/AnimatedSection';
import SectionHeading from '../shared/SectionHeading';
import Icon from '../shared/Icon';
import { ondcSteps } from '../../constants/features';

export default function ONDC() {
  return (
    <AnimatedSection id="ondc" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="How ONDC Works"
          subtitle="India's open network democratizes digital commerce — and Cerve makes it effortless"
        />

        {/* ONDC explainer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-3xl mx-auto text-center"
        >
          <div className="rounded-2xl bg-cerve-card border border-white/5 p-8">
            <div className="w-16 h-16 rounded-2xl bg-cerve-secondary/10 flex items-center justify-center mx-auto mb-4">
              <Icon name="globe" size={32} className="text-cerve-secondary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Open Network for Digital Commerce</h3>
            <p className="text-cerve-muted leading-relaxed">
              ONDC is a government-backed initiative that creates an open, interoperable network for digital commerce in India.
              Unlike closed marketplaces, any seller can connect to any buyer app — breaking platform monopolies
              and giving businesses direct access to millions of consumers.
            </p>
          </div>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-cerve-primary/0 via-cerve-primary/30 to-cerve-primary/0" />

          <div className="grid lg:grid-cols-3 gap-8">
            {ondcSteps.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative text-center"
              >
                {/* Step number */}
                <div className="text-7xl font-extrabold text-cerve-primary/5 absolute -top-4 left-1/2 -translate-x-1/2 select-none pointer-events-none">
                  {item.step}
                </div>

                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-cerve-primary/10 border border-cerve-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Icon name={item.icon} size={28} className="text-cerve-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-cerve-muted leading-relaxed max-w-xs mx-auto">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
