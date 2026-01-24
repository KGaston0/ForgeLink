import { Button } from '../../common/Button/Button';

export function PricingSection() {
  return (
    <section id="pricing" className="pricing-section">
      <div className="section-container">
        <div className="section-header-centered">
          <div className="section-eyebrow-centered">
            <span className="pulse-dot"></span>
            <span className="eyebrow-text">Plans & Pricing</span>
          </div>
          <h2 className="section-title-centered">
            TRANSPARENT PRICING FOR<br/>
            <span className="title-accent">EVERY CREATOR.</span>
          </h2>
          <p className="section-description-centered">
            Start building for free. Upgrade as your worlds grow. Cancel anytime.
          </p>
        </div>

        <div className="pricing-table-wrapper spotlight-card">
          <div className="spotlight-effect"></div>
          <div className="spotlight-border"></div>

          <div className="pricing-table">
            {/* Header Row */}
            <div className="pricing-row pricing-header">
              <div className="pricing-cell cell-label">
                <h3 className="compare-title">Compare<span className="compare-subtitle">Plans</span></h3>
                <p className="compare-text">All plans include core features</p>
              </div>
              <div className="pricing-cell cell-plan">
                <div className="plan-badge badge-free">Free</div>
                <div className="plan-price">
                  <span className="price-amount">$0</span>
                  <span className="price-period">Forever</span>
                </div>
              </div>
              <div className="pricing-cell cell-plan plan-featured">
                <div className="plan-badge badge-pro">Pro</div>
                <div className="plan-price">
                  <span className="price-amount">$12</span>
                  <span className="price-period">Per Month</span>
                </div>
              </div>
              <div className="pricing-cell cell-plan">
                <div className="plan-badge badge-team">Teams</div>
                <div className="plan-price">
                  <span className="price-amount">$29</span>
                  <span className="price-period">Per Month</span>
                </div>
              </div>
            </div>

            {/* Feature Rows */}
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
              <div className="pricing-cell cell-feature">Team Members</div>
              <div className="pricing-cell">1</div>
              <div className="pricing-cell cell-featured">5</div>
              <div className="pricing-cell">Unlimited</div>
            </div>

            <div className="pricing-row">
              <div className="pricing-cell cell-feature">Version History</div>
              <div className="pricing-cell">7 days</div>
              <div className="pricing-cell cell-featured">
                <svg className="checkmark" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div className="pricing-cell">
                <svg className="checkmark" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>

            <div className="pricing-row">
              <div className="pricing-cell cell-feature">Priority Support</div>
              <div className="pricing-cell">
                <svg className="xmark" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
              </div>
              <div className="pricing-cell cell-featured">
                <svg className="checkmark" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div className="pricing-cell">
                <svg className="checkmark" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>

            {/* CTA Row */}
            <div className="pricing-row pricing-cta-row">
              <div className="pricing-cell"></div>
              <div className="pricing-cell">
                <Button variant="secondary" className="btn-full">Get Started</Button>
              </div>
              <div className="pricing-cell cell-featured">
                <Button variant="primary" className="btn-full">Start Free Trial</Button>
              </div>
              <div className="pricing-cell">
                <Button variant="secondary" className="btn-full">Contact Sales</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
