import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import HowItWorks from '../components/home/HowItWorks';
import Demo from '../components/home/Demo';
import Actions from '../components/home/Actions';
import Safety from '../components/home/Safety';
import Comparison from '../components/home/Comparison';
import FAQ from '../components/home/FAQ';
import CTA from '../components/home/CTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Demo />
      <Actions />
      <Safety />
      <Comparison />
      <FAQ limit={6} />
      <CTA />
    </>
  );
}
