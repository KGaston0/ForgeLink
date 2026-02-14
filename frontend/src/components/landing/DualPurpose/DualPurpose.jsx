import './DualPurpose.css';

/**
 * DualPurpose Component
 *
 * Showcases the two main use cases of ForgeLink
 * Features:
 * - Project Management panel
 * - Creative Writing panel
 * - Alternating layouts
 * - Visual diagrams
 * - Statistics
 */
export function DualPurpose() {
  return (
    <section className="dual-purpose-section">
      {/* Project Management Panel */}
      <div className="purpose-panel">
        <div className="panel-content-wrapper">
          <div className="panel-content">
            <div className="panel-eyebrow">
              <span className="pulse-dot"></span>
              <span className="eyebrow-text">For Project Managers</span>
            </div>
            <h2 className="panel-title">
              Track Dependencies.<br/>
              Visualize Progress.
            </h2>
            <p className="panel-description">
              Build your project structure with custom task nodes. Link dependencies,
              track progress, and see the entire project landscape at a glance.
              No rigid templates—just your workflow, visualized.
            </p>
            <div className="panel-stats">
              <div className="stat-item">
                <span className="stat-value">40%</span>
                <span className="stat-label">Faster Planning</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">100%</span>
                <span className="stat-label">Customizable</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">∞</span>
                <span className="stat-label">Node Types</span>
              </div>
            </div>
          </div>
          <div className="panel-visual">
            <div className="visual-card">
              <div className="flow-diagram">
                <div className="flow-node">
                  <span className="flow-icon">📋</span>
                  <span className="flow-label">Planning</span>
                </div>
                <span className="flow-arrow">→</span>
                <div className="flow-node">
                  <span className="flow-icon">⚙️</span>
                  <span className="flow-label">Development</span>
                </div>
                <span className="flow-arrow">→</span>
                <div className="flow-node">
                  <span className="flow-icon">✅</span>
                  <span className="flow-label">Testing</span>
                </div>
                <span className="flow-arrow">→</span>
                <div className="flow-node">
                  <span className="flow-icon">🚀</span>
                  <span className="flow-label">Deploy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Creative Writing Panel */}
      <div className="purpose-panel panel-alternate">
        <div className="panel-content-wrapper panel-reverse">
          <div className="panel-content">
            <div className="panel-eyebrow">
              <span className="pulse-dot"></span>
              <span className="eyebrow-text">For Creative Writers</span>
            </div>
            <h2 className="panel-title">
              Build Worlds.<br/>
              Connect Stories.
            </h2>
            <p className="panel-description">
              Craft characters, locations, and plot points as interconnected nodes.
              Visualize relationships, track story arcs, and discover hidden connections
              in your narrative universe.
            </p>
            <div className="panel-stats">
              <div className="stat-item">
                <span className="stat-value">∞</span>
                <span className="stat-label">Characters</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">100%</span>
                <span className="stat-label">Your Canon</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">0</span>
                <span className="stat-label">Limitations</span>
              </div>
            </div>
          </div>
          <div className="panel-visual">
            <div className="visual-card">
              <div className="visual-grid">
                <div className="grid-item">
                  <span className="item-icon">👤</span>
                  <span className="item-label">Characters</span>
                </div>
                <div className="grid-item">
                  <span className="item-icon">🗺️</span>
                  <span className="item-label">Locations</span>
                </div>
                <div className="grid-item">
                  <span className="item-icon">📖</span>
                  <span className="item-label">Chapters</span>
                </div>
                <div className="grid-item">
                  <span className="item-icon">⚔️</span>
                  <span className="item-label">Events</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

