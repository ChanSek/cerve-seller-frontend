import { motion } from 'framer-motion';
import AnimatedSection from '../shared/AnimatedSection';
import SectionHeading from '../shared/SectionHeading';
import Icon from '../shared/Icon';
import Button from '../shared/Button';
import { products } from '../../constants/products';

export default function Products() {
  return (
    <AnimatedSection id="products" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Our Products"
          subtitle="Two powerful tools to transform how you do commerce"
        />

        <div className="grid md:grid-cols-2 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group relative rounded-2xl bg-cerve-card border border-white/5 hover:border-cerve-primary/30 p-8 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${
                i === 0 ? 'bg-cerve-primary/10' : 'bg-cerve-secondary/10'
              } mb-6`}>
                <Icon
                  name={product.icon}
                  size={28}
                  className={i === 0 ? 'text-cerve-primary' : 'text-cerve-secondary'}
                />
              </div>

              <h3 className="text-2xl font-bold text-white mb-1">{product.name}</h3>
              <p className="text-sm text-cerve-secondary font-medium mb-3">{product.tagline}</p>
              <p className="text-cerve-muted mb-6">{product.description}</p>

              {/* Highlights */}
              <ul className="space-y-2 mb-8">
                {product.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-center gap-2 text-sm text-cerve-text">
                    <Icon name="check" size={16} className="text-cerve-success flex-shrink-0" />
                    {highlight}
                  </li>
                ))}
              </ul>

              <Button variant="secondary" size="sm" href={product.href}>
                Explore {product.name}
                <Icon name="arrowRight" size={16} />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
