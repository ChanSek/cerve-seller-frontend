import { motion } from 'framer-motion';
import Button from '../shared/Button';
import Icon from '../shared/Icon';

const stats = [
  { label: 'Categories', value: '6+' },
  { label: 'Buyer Apps', value: '20+' },
  { label: 'Search Strategies', value: '6' },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-cerve-primary/10 blur-[128px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-cerve-secondary/10 blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cerve-primary/5 blur-[200px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-cerve-primary/10 text-cerve-primary border border-cerve-primary/20 mb-6">
              Powered by ONDC — India's Open Commerce Network
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight"
          >
            Commerce,{' '}
            <span className="text-gradient">Reimagined.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-cerve-muted max-w-2xl mx-auto"
          >
            The open platform that connects sellers to millions of buyers across India.
            Manage your store, products, and orders — all powered by ONDC.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Button size="lg" href="https://seller.cerve.in">
              <Icon name="store" size={20} />
              Start Selling
            </Button>
            <Button size="lg" variant="secondary" href="https://claw.cerve.in">
              <Icon name="brain" size={20} />
              Try Claw AI
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {stats.map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-gradient">{value}</div>
                <div className="mt-1 text-sm text-cerve-muted">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
