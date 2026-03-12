import { motion } from 'framer-motion';
import AnimatedSection from '../shared/AnimatedSection';
import SectionHeading from '../shared/SectionHeading';
import Card from '../shared/Card';
import Icon from '../shared/Icon';
import { categories } from '../../constants/features';

export default function Categories() {
  return (
    <AnimatedSection id="categories" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Sell Across Categories"
          subtitle="From groceries to electronics — one platform, every category"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card className="h-full">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cerve-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name={cat.icon} size={20} className="text-cerve-secondary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-white">{cat.name}</h3>
                      <span className="text-xs text-cerve-muted font-mono bg-cerve-elevated px-2 py-0.5 rounded">{cat.code}</span>
                    </div>
                    <p className="text-sm text-cerve-muted">{cat.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
