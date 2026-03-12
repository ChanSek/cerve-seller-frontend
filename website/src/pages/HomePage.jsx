import Hero from '../components/home/Hero';
import Products from '../components/home/Products';
import Features from '../components/home/Features';
import ONDC from '../components/home/ONDC';
import Categories from '../components/home/Categories';
import CTA from '../components/home/CTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Products />
      <Features />
      <ONDC />
      <Categories />
      <CTA />
    </>
  );
}
