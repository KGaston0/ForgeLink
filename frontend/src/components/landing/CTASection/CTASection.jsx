import { Button } from '../../common/Button/Button';

export function CTASection() {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <h2 className="cta-title">
          READY TO BUILD<br/>
          <span className="cta-title-accent">YOUR SYSTEM?</span>
        </h2>
        <p className="cta-description">
          Join thousands of creators using LinkForge to organize their ideas, projects, and knowledge—their way.
        </p>
        <div className="cta-buttons">
          <Button variant="primary" size="lg" className="magnetic-btn">
            Start Building Free
          </Button>
          <Button variant="secondary" size="lg">
            Watch Demo
          </Button>
        </div>
        <p className="cta-note">No credit card required • 3 projects free forever</p>
      </div>
    </section>
  );
}
