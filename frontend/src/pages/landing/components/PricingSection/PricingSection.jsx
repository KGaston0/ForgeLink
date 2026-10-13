
/**
 * PricingSection Component - Simplified and modern pricing cards
 */
export function PricingSection() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out ForgeLink',
      features: [
        '3 Projects',
        '100 Nodes per project',
        'Custom node types',
        'Unlimited connections',
        'JSON export',
      ],
      cta: 'Start Free',
      featured: false,
    },
    {
      name: 'Pro',
      price: '$12',
      period: 'per month',
      description: 'For serious creators and managers',
      features: [
        'Unlimited projects',
        'Unlimited nodes',
        'Custom node types',
        'Unlimited connections',
        'JSON, CSV, PDF export',
        'Priority support',
      ],
      cta: 'Go Pro',
      featured: true,
    },
    {
      name: 'Team',
      price: '$39',
      period: 'per month',
      description: 'For teams working together',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Shared workspaces',
        'Admin controls',
        'Advanced permissions',
        'Dedicated support',
      ],
      cta: 'Contact Sales',
      featured: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 px-8 bg-[rgb(var(--color-bg))]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-sm text-cyan-500 font-medium mb-6">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
            <span>Pricing</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[rgb(var(--color-text))] mb-4">
            Start Free. Scale as You Grow.
          </h2>
          <p className="text-lg text-[rgb(var(--color-text-secondary))] max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include core features with no hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 ${
                plan.featured
                  ? 'bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/50 shadow-xl scale-105'
                  : 'bg-[rgb(var(--color-bg-secondary))] border-[rgb(var(--color-border))] hover:border-cyan-500/30'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[rgb(var(--color-text))] mb-2">{plan.name}</h3>
                <p className="text-sm text-[rgb(var(--color-text-muted))]">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-[rgb(var(--color-text))]">{plan.price}</span>
                  <span className="text-[rgb(var(--color-text-muted))]">/{plan.period}</span>
                </div>
              </div>

              <button className={`w-full py-3 rounded-lg font-semibold mb-6 transition-all ${
                plan.featured
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600'
                  : 'bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))]'
              }`}>
                {plan.cta}
              </button>

              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-cyan-500 mt-1">✓</span>
                    <span className="text-sm text-[rgb(var(--color-text-secondary))]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
