import { Button } from '../../common/Button/Button';

export function HeroSection() {
  return (
    <header className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="pulse-dot"></span>
            <span className="badge-text">10,000+ Connections Forged Daily</span>
          </div>
          <h1 className="hero-title">
            FORGE YOUR LINKS.<br/>
            <span className="hero-title-accent">CONNECT YOUR WORLD.</span><br/>
            BUILD YOUR UNIVERSE.
          </h1>
          <p className="hero-description">
            LinkForge lets you create custom node types and connect them in any way you need. Build project
            workflows, story worlds, or knowledge graphs with complete flexibility. From software architecture
            and sprint planning to worldbuilding and character development—organize your ideas the way you think.
          </p>
          <div className="hero-cta">
            <Button variant="primary" size="lg" className="magnetic-btn">
              Start Forging Free
            </Button>
            <div className="hero-stat">
              <span className="stat-label">No Credit Card</span>
              <span className="stat-value">Forever Free Plan</span>
            </div>
          </div>
        </div>

        {/* Node Canvas Preview */}
        <div className="hero-visual">
          <div id="node-canvas-wrapper" className="node-canvas-container">
            <svg className="node-canvas" viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg">
              <g className="connections" opacity="0.3">
                <path d="M150 100 L300 150" stroke="url(#gradient-cyan)" strokeWidth="2" strokeDasharray="5,5"/>
                <path d="M300 150 L450 120" stroke="url(#gradient-pink)" strokeWidth="2" strokeDasharray="5,5"/>
                <path d="M150 100 L200 280" stroke="url(#gradient-cyan)" strokeWidth="2" strokeDasharray="5,5"/>
                <path d="M300 150 L350 300" stroke="url(#gradient-pink)" strokeWidth="2" strokeDasharray="5,5"/>
                <path d="M450 120 L500 280" stroke="url(#gradient-cyan)" strokeWidth="2" strokeDasharray="5,5"/>
              </g>

              <defs>
                <linearGradient id="gradient-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{stopColor:"#06b6d4", stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:"#14b8a6", stopOpacity:1}} />
                </linearGradient>
                <linearGradient id="gradient-pink" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{stopColor:"#ec4899", stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:"#f472b6", stopOpacity:1}} />
                </linearGradient>
              </defs>

              <g className="node character-node" transform="translate(150, 100)">
                <circle r="30" fill="url(#gradient-cyan)" opacity="0.2"/>
                <circle r="25" fill="#06b6d4" opacity="0.9"/>
                <circle r="25" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="3"/>
                <text x="0" y="5" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">🎯</text>
              </g>

              <g className="node location-node" transform="translate(300, 150)">
                <circle r="35" fill="url(#gradient-pink)" opacity="0.2"/>
                <circle r="28" fill="#ec4899" opacity="0.9"/>
                <circle r="28" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="3"/>
                <text x="0" y="5" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">⚡</text>
              </g>

              <g className="node plot-node" transform="translate(450, 120)">
                <circle r="28" fill="url(#gradient-cyan)" opacity="0.2"/>
                <circle r="23" fill="#14b8a6" opacity="0.9"/>
                <circle r="23" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4,3"/>
                <text x="0" y="5" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">🌟</text>
              </g>

              <g className="node task-node" transform="translate(200, 280)">
                <circle r="25" fill="url(#gradient-pink)" opacity="0.2"/>
                <circle r="20" fill="#f472b6" opacity="0.9"/>
                <circle r="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4,3"/>
                <text x="0" y="5" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">💡</text>
              </g>

              <g className="node relationship-node" transform="translate(350, 300)">
                <circle r="26" fill="url(#gradient-cyan)" opacity="0.2"/>
                <circle r="21" fill="#06b6d4" opacity="0.9"/>
                <circle r="21" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="3"/>
                <text x="0" y="5" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">🔗</text>
              </g>

              <g className="node timeline-node" transform="translate(500, 280)">
                <circle r="27" fill="url(#gradient-pink)" opacity="0.2"/>
                <circle r="22" fill="#ec4899" opacity="0.9"/>
                <circle r="22" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4,3"/>
                <text x="0" y="5" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">🎨</text>
              </g>
            </svg>
          </div>

          {/* Floating Node Cards */}
          <div className="floating-card card-1">
            <div className="card-icon">📋</div>
            <div className="card-content">
              <div className="card-label">Project Node</div>
              <div className="card-title">Sprint Planning</div>
            </div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">✨</div>
            <div className="card-content">
              <div className="card-label">Story Node</div>
              <div className="card-title">Character Arc</div>
            </div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">🔗</div>
            <div className="card-content">
              <div className="card-label">Connection</div>
              <div className="card-title">Dependencies</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
