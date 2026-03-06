import { motion } from 'framer-motion';
import AnimatedSection from '../shared/AnimatedSection';
import SectionHeading from '../shared/SectionHeading';
import Icon from '../shared/Icon';
import { currentActions, comingSoonActions } from '../../constants/actions';

function ActionChip({ action, index, comingSoon = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
        comingSoon
          ? 'bg-claw-card/50 border-white/5 opacity-60'
          : 'bg-claw-card border-white/10 hover:border-claw-primary/30'
      }`}
    >
      <Icon name={action.icon} size={20} className={comingSoon ? 'text-claw-muted' : 'text-claw-primary'} />
      <div>
        <p className={`text-sm font-medium ${comingSoon ? 'text-claw-muted' : 'text-white'}`}>
          {action.name}
        </p>
        <p className="text-xs text-claw-muted">{action.description}</p>
      </div>
    </motion.div>
  );
}

export default function Actions() {
  return (
    <AnimatedSection className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="What Claw Can Do"
          subtitle="A growing set of actions that let AI control your phone."
        />

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-claw-primary uppercase tracking-wider mb-4">Available Now</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {currentActions.map((action, i) => (
              <ActionChip key={action.name} action={action} index={i} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-claw-muted uppercase tracking-wider mb-4">Coming Soon</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {comingSoonActions.map((action, i) => (
              <ActionChip key={action.name} action={action} index={i} comingSoon />
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
