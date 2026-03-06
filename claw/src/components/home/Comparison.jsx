import AnimatedSection from '../shared/AnimatedSection';
import SectionHeading from '../shared/SectionHeading';
import Icon from '../shared/Icon';
import { comparisonFeatures, competitors } from '../../constants/comparisons';

export default function Comparison() {
  return (
    <AnimatedSection className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          title="How Claw Compares"
          subtitle="See how Claw stacks up against other Android AI agents."
        />

        <div className="rounded-2xl bg-claw-card border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-4 text-sm font-medium text-claw-muted">Feature</th>
                  {competitors.map((c) => (
                    <th
                      key={c.name}
                      className={`px-6 py-4 text-sm font-bold text-center ${
                        c.highlight ? 'text-gradient' : 'text-claw-muted'
                      }`}
                    >
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, i) => (
                  <tr key={row.feature} className={i < comparisonFeatures.length - 1 ? 'border-b border-white/5' : ''}>
                    <td className="px-6 py-3 text-sm text-claw-text">{row.feature}</td>
                    {['claw', 'droidrun', 'greenclaw'].map((key) => (
                      <td key={key} className="px-6 py-3 text-center">
                        {typeof row[key] === 'boolean' ? (
                          row[key] ? (
                            <Icon name="check" size={20} className="inline text-claw-success" />
                          ) : (
                            <Icon name="x" size={20} className="inline text-claw-danger/50" />
                          )
                        ) : (
                          <span
                            className={`text-sm font-medium ${
                              key === 'claw' ? 'text-claw-success' : 'text-claw-muted'
                            }`}
                          >
                            {row[key]}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
