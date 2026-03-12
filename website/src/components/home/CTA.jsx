import { motion } from 'framer-motion';
import AnimatedSection from '../shared/AnimatedSection';
import Button from '../shared/Button';
import Icon from '../shared/Icon';

export default function CTA() {
  return (
    <AnimatedSection className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          whileInView={{ scale: [0.95, 1] }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-cerve-gradient p-px overflow-hidden"
        >
          <div className="rounded-3xl bg-cerve-bg/90 backdrop-blur-sm px-8 py-16 sm:px-16 text-center">
            {/* Glow effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-cerve-primary/20 blur-[100px]" />
            </div>

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
                Ready to Join the Open Network?
              </h2>
              <p className="text-lg text-cerve-muted mb-8 max-w-xl mx-auto">
                Start selling on ONDC today. Reach millions of buyers, manage your business effortlessly, and grow with the open commerce revolution.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" href="https://seller.cerve.in">
                  <Icon name="store" size={20} />
                  Open Seller Portal
                </Button>
                <Button size="lg" variant="secondary" href="https://claw.cerve.in">
                  <Icon name="brain" size={20} />
                  Explore Claw AI
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
