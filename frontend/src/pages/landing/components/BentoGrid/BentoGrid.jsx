
export function BentoGrid() {
  return (
    <section id="gallery" className="py-24 px-8 bg-[rgb(var(--color-bg))]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-sm text-cyan-500 font-medium mb-6">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
            <span>Core Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[rgb(var(--color-text))] mb-4">
            BUILD CONNECTIONS<br/>
            <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
              THE WAY YOU IMAGINE.
            </span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {/* Large Card - Spans 2x2 */}
          <div className="lg:col-span-2 lg:row-span-2 p-8 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-2xl hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <span className="text-4xl font-bold text-cyan-500/30">01</span>
                <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs text-cyan-500 font-medium">Fully Custom</span>
              </div>
              <h3 className="text-2xl font-bold text-[rgb(var(--color-text))] mb-3">
                Forge Your<br/>Own Nodes
              </h3>
              <p className="text-[rgb(var(--color-text-secondary))] mb-4 text-sm">
                Create node types that match your exact vision. Add custom properties, labels, and metadata—no predefined templates or restrictions.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-full text-xs text-[rgb(var(--color-text-secondary))]">Custom Attributes</span>
                <span className="px-3 py-1 bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-full text-xs text-[rgb(var(--color-text-secondary))]">Flexible Types</span>
                <span className="px-3 py-1 bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-full text-xs text-[rgb(var(--color-text-secondary))]">Your Schema</span>
              </div>
              <div className="mt-6 p-4 bg-[rgb(var(--color-bg))]/50 rounded-lg backdrop-blur-sm">
                <div className="text-3xl mb-2">📋</div>
                <div className="text-sm font-medium text-[rgb(var(--color-text))]">Project Template</div>
              </div>
            </div>
          </div>

          {/* Tall Card - Spans 1x2 */}
          <div className="lg:row-span-2 p-6 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-2xl hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <span className="text-3xl font-bold text-purple-500/30 block mb-4">02</span>
              <h3 className="text-xl font-bold text-[rgb(var(--color-text))] mb-3">
                Link<br/>Infinitely
              </h3>
              <p className="text-[rgb(var(--color-text-secondary))] text-sm mb-6">
                Each node can contain more nodes. Create hierarchies as deep as you need—forge links within links within links.
              </p>
              <div className="p-4 bg-[rgb(var(--color-bg))]/50 rounded-lg backdrop-blur-sm">
                <div className="text-3xl mb-2">📂</div>
                <div className="text-xs font-medium text-[rgb(var(--color-text))]">Workspace → Projects → Tasks</div>
              </div>
            </div>
          </div>

          {/* Wide Card */}
          <div className="lg:col-span-2 p-6 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-2xl hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <span className="text-3xl font-bold text-cyan-500/30 block mb-3">03</span>
              <h3 className="text-xl font-bold text-[rgb(var(--color-text))] mb-2">Organize in Forges</h3>
              <p className="text-[rgb(var(--color-text-secondary))] text-sm">
                Create separate workspaces (forges) for different projects. Link nodes across forges or keep them isolated—your choice.
              </p>
            </div>
          </div>

          {/* Square Card 1 */}
          <div className="p-6 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-2xl hover:border-pink-500/50 transition-all duration-300 hover:-translate-y-1 hover:scale-105 relative overflow-hidden group flex flex-col items-center justify-center text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-4">🔗</div>
              <h3 className="text-lg font-bold text-[rgb(var(--color-text))]">Cross-Forge<br/>Links</h3>
            </div>
          </div>

          {/* Square Card 2 */}
          <div className="p-6 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-2xl hover:border-yellow-500/50 transition-all duration-300 hover:-translate-y-1 hover:scale-105 relative overflow-hidden group flex flex-col items-center justify-center text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-lg font-bold text-[rgb(var(--color-text))]">Forge<br/>Anything</h3>
            </div>
          </div>

          {/* Wide Card 2 */}
          <div className="lg:col-span-2 p-6 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-2xl hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <span className="text-3xl font-bold text-purple-500/30 block mb-3">04</span>
              <h3 className="text-xl font-bold text-[rgb(var(--color-text))] mb-2">True Link Structure</h3>
              <p className="text-[rgb(var(--color-text-secondary))] text-sm">
                Every node is a potential link. Connect related concepts, visualize relationships, and watch patterns emerge from your forged connections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


