import './PricingSection.css';
import '../common.css';

/**
 * PricingSection Component
 *
 * Pricing comparison table
 * Features:
 * - Three pricing tiers (Free, Pro, Team)
 * - Feature comparison
 * - Highlighted featured plan
 * - CTA buttons
 * - Responsive grid
 */
export function PricingSection() {
  return (
    <section id="pricing" className="pricing-section">
      <div className="section-header-centered">
        <div className="section-eyebrow-centered">
          <span className="pulse-dot"></span>
          <span className="eyebrow-text">Pricing</span>
        </div>
        <h2 className="section-title-centered">
          Start Free. Scale as You Grow.
        </h2>
        <p className="section-description-centered">
          Choose the plan that fits your needs. All plans include core features with no hidden fees.
        </p>
      </div>

      <div className="pricing-table-wrapper">
        <div className="pricing-table">
          {/* Header Row */}
          <div className="pricing-row pricing-header">
            <div className="pricing-cell cell-label">
              <div className="compare-title">
                Compare Plans
                <span className="compare-subtitle">Choose what works for you</span>
              </div>
            </div>
            <div className="pricing-cell cell-plan">
              <span className="plan-badge badge-free">Free</span>
              <div className="plan-price">
                <span className="price-amount">$0</span>
                <span className="price-period">forever</span>
              </div>
            </div>
            <div className="pricing-cell cell-plan cell-featured plan-featured">
              <span className="plan-badge badge-pro">Pro</span>
              <div className="plan-price">
                <span className="price-amount">$12</span>
                <span className="price-period">per month</span>
              </div>
            </div>
            <div className="pricing-cell cell-plan">
              <span className="plan-badge badge-team">Team</span>
              <div className="plan-price">
                <span className="price-amount">$39</span>
                <span className="price-period">per month</span>
              </div>
            </div>
          </div>

          {/* Feature Rows */}
          <div className="pricing-row">
            <div className="pricing-cell cell-feature">Custom Nodes</div>
            <div className="pricing-cell"><span className="checkmark">✓</span></div>
            <div className="pricing-cell cell-featured"><span className="checkmark">✓</span></div>
            <div className="pricing-cell"><span className="checkmark">✓</span></div>
          </div>

          <div className="pricing-row">
            <div className="pricing-cell cell-feature">Unlimited Connections</div>
            <div className="pricing-cell"><span className="checkmark">✓</span></div>
            <div className="pricing-cell cell-featured"><span className="checkmark">✓</span></div>
            <div className="pricing-cell"><span className="checkmark">✓</span></div>
          </div>

          <div className="pricing-row">
            <div className="pricing-cell cell-feature">Projects</div>
            <div className="pricing-cell">3</div>
            <div className="pricing-cell cell-featured">Unlimited</div>
            <div className="pricing-cell">Unlimited</div>
          </div>

          <div className="pricing-row">
            <div className="pricing-cell cell-feature">Nodes per Project</div>
            <div className="pricing-cell">100</div>
            <div className="pricing-cell cell-featured">Unlimited</div>
            <div className="pricing-cell">Unlimited</div>
          </div>

          <div className="pricing-row">
            <div className="pricing-cell cell-feature">Export Options</div>
            <div className="pricing-cell">JSON</div>
            <div className="pricing-cell cell-featured">JSON, CSV, PDF</div>
            <div className="pricing-cell">JSON, CSV, PDF</div>
          </div>

          <div className="pricing-row">
            <div className="pricing-cell cell-feature">Collaboration</div>
            <div className="pricing-cell"><span className="xmark">✗</span></div>
            <div className="pricing-cell cell-featured">2 members</div>
            <div className="pricing-cell">Unlimited</div>
          </div>

          <div className="pricing-row">
            <div className="pricing-cell cell-feature">Priority Support</div>
            <div className="pricing-cell"><span className="xmark">✗</span></div>
            <div className="pricing-cell cell-featured"><span className="checkmark">✓</span></div>
            <div className="pricing-cell"><span className="checkmark">✓</span></div>
          </div>

          <div className="pricing-row">
            <div className="pricing-cell cell-feature">Advanced Analytics</div>
            <div className="pricing-cell"><span className="xmark">✗</span></div>
            <div className="pricing-cell cell-featured"><span className="xmark">✗</span></div>
            <div className="pricing-cell"><span className="checkmark">✓</span></div>
          </div>

          {/* CTA Row */}
          <div className="pricing-row pricing-cta-row">
            <div className="pricing-cell cell-label"></div>
            <div className="pricing-cell">
              <button className="btn btn-secondary btn-full">Start Free</button>
            </div>
            <div className="pricing-cell cell-featured">
              <button className="btn btn-primary btn-full">Get Pro</button>
            </div>
            <div className="pricing-cell">
              <button className="btn btn-secondary btn-full">Contact Sales</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


