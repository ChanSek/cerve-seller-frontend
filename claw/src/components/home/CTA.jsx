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
          className="relative rounded-3xl bg-claw-gradient p-px overflow-hidden"
        >
          <div className="rounded-3xl bg-claw-bg/90 backdrop-blur-sm px-8 py-16 sm:px-16 text-center">
            {/* Glow effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-claw-primary/20 blur-[100px]" />
            </div>

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
                Ready to Let AI Handle Your Phone?
              </h2>
              <p className="text-lg text-claw-muted mb-8 max-w-xl mx-auto">
                Download Claw, set up your preferred LLM, and start automating. It's open source, free, and built with safety first.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" href="https://github.com/AsClaw/CerveAIClaw">
                  <Icon name="download" size={20} />
                  Download for Android
                </Button>
                <Button size="lg" variant="secondary" href="https://github.com/AsClaw/CerveAIClaw">
                  <Icon name="github" size={20} />
                  View on GitHub
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
