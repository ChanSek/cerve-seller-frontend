import FAQ from '../components/home/FAQ';
import CTA from '../components/home/CTA';
import AnimatedSection from '../components/shared/AnimatedSection';

export default function FAQPage() {
  return (
    <div className="pt-24">
      <AnimatedSection className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient mb-6">
            FAQ
          </h1>
          <p className="text-lg text-claw-muted max-w-2xl mx-auto">
            Everything you need to know about Claw, answered.
          </p>
        </div>
      </AnimatedSection>

      <FAQ limit={null} />
      <CTA />
    </div>
  );
}
