import './HeroSection.css';
import '../common.css';

/**
 * HeroSection Component
 *
 * Main hero section with animated node canvas
 * Features:
 * - Animated badge
 * - Hero title with gradient accent
 * - Description text
 * - CTA buttons
 * - Node canvas visualization
 * - Floating cards
 */
export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="pulse-dot"></span>
            <span>Visual Knowledge Management</span>
          </div>
          <h1 className="hero-title">
            Build Your Ideas as <span className="hero-title-accent">Connected Networks</span>
          </h1>
          <p className="hero-description">
            ForgeLink transforms how you organize information. Create custom nodes, forge meaningful connections,
            and visualize your knowledge like never before—whether you're managing projects or building worlds.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-large">Start Free</button>
            <button className="btn btn-secondary btn-large">Watch Demo</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="node-canvas-container">
            <svg className="node-canvas" viewBox="0 0 450 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Central Node */}
              <circle className="node" cx="225" cy="200" r="40" fill="url(#gradient-cyan)" />
              {/* Surrounding Nodes */}
              <circle className="node" cx="100" cy="100" r="30" fill="url(#gradient-pink)" />
              <circle className="node" cx="350" cy="100" r="30" fill="url(#gradient-purple)" />
              <circle className="node" cx="100" cy="300" r="30" fill="url(#gradient-teal)" />
              <circle className="node" cx="350" cy="300" r="30" fill="url(#gradient-orange)" />
              {/* Connection Lines */}
              <line x1="225" y1="200" x2="100" y2="100" stroke="url(#gradient-line)" strokeWidth="2" opacity="0.5" />
              <line x1="225" y1="200" x2="350" y2="100" stroke="url(#gradient-line)" strokeWidth="2" opacity="0.5" />
              <line x1="225" y1="200" x2="100" y2="300" stroke="url(#gradient-line)" strokeWidth="2" opacity="0.5" />
              <line x1="225" y1="200" x2="350" y2="300" stroke="url(#gradient-line)" strokeWidth="2" opacity="0.5" />
              {/* Gradients */}
              <defs>
                <linearGradient id="gradient-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
                <linearGradient id="gradient-pink" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="gradient-teal" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="gradient-orange" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <linearGradient id="gradient-line">
                  <stop offset="0%" stopColor="#06b6d4" opacity="0.5" />
                  <stop offset="100%" stopColor="#ec4899" opacity="0.5" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Floating Cards */}
          <div className="floating-card card-1">
            <span className="card-icon">📊</span>
            <div className="card-content">
              <span className="card-label">Project</span>
              <span className="card-title">Sprint Planning</span>
            </div>
          </div>
          <div className="floating-card card-2">
            <span className="card-icon">🎨</span>
            <div className="card-content">
              <span className="card-label">Creative</span>
              <span className="card-title">World Building</span>
            </div>
          </div>
          <div className="floating-card card-3">
            <span className="card-icon">🔗</span>
            <div className="card-content">
              <span className="card-label">Connected</span>
              <span className="card-title">12 Links</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


