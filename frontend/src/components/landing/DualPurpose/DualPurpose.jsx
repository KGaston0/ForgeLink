export function DualPurpose() {
  return (
    <section className="dual-purpose-section">
      <div className="purpose-panel">
        <div className="panel-content-wrapper">
          <div className="panel-text">
            <div className="panel-eyebrow">
              <span className="eyebrow-line"></span>
              <span className="eyebrow-text">For Project Management</span>
            </div>
            <h2 className="panel-title">
              ORGANIZE<br/>
              <span className="title-accent">ANYTHING.</span>
            </h2>
            <p className="panel-description">
              Build custom workflows for any project. Create Project nodes with Tasks, Milestones, and Dependencies.
              Organize story research with Chapters and Scenes. Plan campaigns with Objectives and Events. The same flexible
              system adapts to any workflow—from agile sprints to creative outlines.
            </p>
            <div className="panel-stats">
              <div className="stat-item">
                <span className="stat-value">Custom</span>
                <span className="stat-label">Workflows</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">Real-Time</span>
                <span className="stat-label">Collaboration</span>
              </div>
            </div>
          </div>
          <div className="panel-visual">
            <div className="visual-card task-flow-visual">
              <div className="flow-diagram">
                <div className="flow-node node-start">
                  <div className="flow-icon">📋</div>
                  <div className="flow-label">Project A</div>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-node node-task">
                  <div className="flow-icon">✓</div>
                  <div className="flow-label">Task 1</div>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-node node-task">
                  <div className="flow-icon">✓</div>
                  <div className="flow-label">Subtask A</div>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-node node-end">
                  <div className="flow-icon">🎯</div>
                  <div className="flow-label">Complete</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="purpose-panel panel-alternate">
        <div className="panel-content-wrapper panel-reverse">
          <div className="panel-visual">
            <div className="visual-card world-building-visual">
              <div className="visual-grid">
                <div className="grid-item item-character">
                  <div className="item-icon">👤</div>
                  <div className="item-label">Characters</div>
                </div>
                <div className="grid-item item-location">
                  <div className="item-icon">🗺️</div>
                  <div className="item-label">Locations</div>
                </div>
                <div className="grid-item item-plot">
                  <div className="item-icon">📖</div>
                  <div className="item-label">Plot Lines</div>
                </div>
              </div>
            </div>
          </div>
          <div className="panel-text">
            <div className="panel-eyebrow">
              <span className="eyebrow-line"></span>
              <span className="eyebrow-text">For Creative Projects</span>
            </div>
            <h2 className="panel-title">
              BUILD WORLDS<br/>
              <span className="title-accent">& STORIES.</span>
            </h2>
            <p className="panel-description">
              Writing a novel? Create workspaces for Characters, Locations, and Plot Arcs—each with detailed nodes inside.
              Building a game world? Map out Factions, Histories, and Relationships. From fantasy epics to sci-fi universes,
              LinkForge adapts to your creative vision.
            </p>
            <div className="panel-stats">
              <div className="stat-item">
                <span className="stat-value">Unlimited</span>
                <span className="stat-label">Node Types</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">Infinite</span>
                <span className="stat-label">Nesting Depth</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
