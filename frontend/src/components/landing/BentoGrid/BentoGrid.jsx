export function BentoGrid() {
  return (
    <section id="gallery" className="bento-section">
      <div className="section-container">
        <div className="section-header">
          <div className="section-eyebrow">
            <span className="pulse-dot"></span>
            <span className="eyebrow-text">Core Features</span>
          </div>
          <h2 className="section-title">
            BUILD CONNECTIONS<br/>
            <span className="title-accent">THE WAY YOU IMAGINE.</span>
          </h2>
        </div>

        <div className="bento-grid">
          <div className="bento-item bento-large spotlight-card">
            <div className="spotlight-effect"></div>
            <div className="spotlight-border"></div>
            <div className="bento-header">
              <div className="bento-number">01</div>
              <span className="bento-badge">Fully Custom</span>
            </div>
            <div className="bento-content">
              <h3 className="bento-title">Forge Your<br/>Own Nodes</h3>
              <p className="bento-text">Create node types that match your exact vision. Add custom properties, labels, and metadata—no predefined templates or restrictions.</p>
              <div className="bento-tags">
                <span className="tag">Custom Attributes</span>
                <span className="tag">Flexible Types</span>
                <span className="tag">Your Schema</span>
              </div>
            </div>
            <div className="bento-visual">
              <div className="node-preview character-preview">
                <div className="preview-icon">📋</div>
                <div className="preview-label">Project Template</div>
              </div>
            </div>
          </div>

          <div className="bento-item bento-tall spotlight-card">
            <div className="spotlight-effect"></div>
            <div className="spotlight-border"></div>
            <div className="bento-number">02</div>
            <div className="bento-content">
              <h3 className="bento-title">Link<br/>Infinitely</h3>
              <p className="bento-text">Each node can contain more nodes. Create hierarchies as deep as you need—forge links within links within links.</p>
            </div>
            <div className="bento-visual">
              <div className="node-preview location-preview">
                <div className="preview-icon">📂</div>
                <div className="preview-label">Workspace → Projects → Tasks</div>
              </div>
            </div>
          </div>

          <div className="bento-item bento-wide spotlight-card">
            <div className="spotlight-effect"></div>
            <div className="spotlight-border"></div>
            <div className="bento-number">03</div>
            <div className="bento-content">
              <h3 className="bento-title">Organize in Forges</h3>
              <p className="bento-text">Create separate workspaces (forges) for different projects. Link nodes across forges or keep them isolated—your choice.</p>
            </div>
          </div>

          <div className="bento-item bento-square spotlight-card">
            <div className="spotlight-effect"></div>
            <div className="spotlight-border"></div>
            <div className="bento-visual-icon">🔗</div>
            <h3 className="bento-title-small">Cross-Forge<br/>Links</h3>
          </div>

          <div className="bento-item bento-square spotlight-card">
            <div className="spotlight-effect"></div>
            <div className="spotlight-border"></div>
            <div className="bento-visual-icon">✨</div>
            <h3 className="bento-title-small">Forge<br/>Anything</h3>
          </div>

          <div className="bento-item bento-wide spotlight-card">
            <div className="spotlight-effect"></div>
            <div className="spotlight-border"></div>
            <div className="bento-number">04</div>
            <div className="bento-content">
              <h3 className="bento-title">True Link Structure</h3>
              <p className="bento-text">Every node is a potential link. Connect related concepts, visualize relationships, and watch patterns emerge from your forged connections.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
