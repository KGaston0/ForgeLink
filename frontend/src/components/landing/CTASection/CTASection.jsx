import './CTASection.css';
import '../common.css';

/**
 * CTASection Component
 *
 * Final call-to-action section
 * Features:
 * - Bold title with gradient accent
 * - Description text
 * - CTA buttons
 * - Additional note
 * - Centered layout
 */
export function CTASection() {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <h2 className="cta-title">
          Ready to <span className="cta-title-accent">Forge Your Links?</span>
        </h2>
        <p className="cta-description">
          Start building your knowledge network today. No credit card required.
          Create unlimited custom nodes and connections from day one.
        </p>
        <div className="cta-buttons">
          <button className="btn btn-primary btn-large">
            Start Free Now
          </button>
          <button className="btn btn-secondary btn-large">
            Schedule Demo
          </button>
        </div>
        <p className="cta-note">
          Free forever. Upgrade when you need more.
        </p>
      </div>
    </section>
  );
}


