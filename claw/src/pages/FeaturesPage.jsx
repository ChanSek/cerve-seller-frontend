import AnimatedSection from '../components/shared/AnimatedSection';
import SectionHeading from '../components/shared/SectionHeading';
import Card from '../components/shared/Card';
import Icon from '../components/shared/Icon';
import CTA from '../components/home/CTA';
import { features, detailedFeatures } from '../constants/features';

export default function FeaturesPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <AnimatedSection className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient mb-6">
            Features
          </h1>
          <p className="text-lg text-claw-muted max-w-2xl mx-auto">
            Every capability designed to make your phone smarter, safer, and more autonomous.
          </p>
        </div>
      </AnimatedSection>

      {/* Overview cards */}
      <AnimatedSection className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <AnimatedSection key={feature.title} delay={i * 0.1}>
              <Card className="h-full" gradient>
                <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-claw-primary/10">
                  <Icon name={feature.icon} size={28} className="text-claw-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-claw-muted leading-relaxed mb-4">{feature.description}</p>
                <p className="text-sm text-claw-text leading-relaxed">{feature.detail}</p>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </AnimatedSection>

      {/* Detailed categories */}
      {detailedFeatures.map((category, ci) => (
        <AnimatedSection key={category.category} className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              title={category.category}
              gradient={false}
              align="left"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {category.items.map((item, i) => (
                <AnimatedSection key={item.title} delay={i * 0.08}>
                  <Card className="h-full">
                    <Icon name={item.icon} size={20} className="text-claw-primary mb-3" />
                    <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-xs text-claw-muted">{item.description}</p>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </AnimatedSection>
      ))}

      {/* Plugin API preview */}
      <AnimatedSection className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            title="Plugin API Preview"
            subtitle="Build custom integrations with the Claw plugin system."
          />
          <div className="rounded-2xl bg-claw-card border border-white/10 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-claw-elevated border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs text-claw-muted font-mono">ZomatoPlugin.kt</span>
            </div>
            <pre className="p-6 text-sm font-mono text-claw-text overflow-x-auto leading-relaxed">
              <code>{`class ZomatoPlugin : ClawPlugin {
    override val appPackage = "com.application.zomato"
    override val name = "Zomato"

    override fun getActions(): List<PluginAction> = listOf(
        PluginAction(
            name = "order_food",
            description = "Order food from a restaurant",
            parameters = listOf("dish", "restaurant"),
            safetyLevel = SafetyLevel.REQUIRES_CONFIRMATION
        ),
        PluginAction(
            name = "search_restaurant",
            description = "Search for restaurants nearby",
            parameters = listOf("query", "cuisine"),
            safetyLevel = SafetyLevel.SAFE
        )
    )
}`}</code>
            </pre>
          </div>
        </div>
      </AnimatedSection>

      <CTA />
    </div>
  );
}
