
/**
 * DualPurpose Component
 *
 * Showcases the two main use cases of ForgeLink
 */
export function DualPurpose() {
  return (
    <section className="py-24 px-8 bg-gradient-to-br from-cyan-500/5 to-purple-500/5">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Project Management Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-sm text-cyan-500 font-medium">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
              <span>For Project Managers</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[rgb(var(--color-text))]">
              Track Dependencies.<br/>
              Visualize Progress.
            </h2>
            <p className="text-lg text-[rgb(var(--color-text-secondary))]">
              Build your project structure with custom task nodes. Link dependencies,
              track progress, and see the entire project landscape at a glance.
              No rigid templates—just your workflow, visualized.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-500 mb-1">40%</div>
                <div className="text-sm text-[rgb(var(--color-text-muted))]">Faster Planning</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-500 mb-1">100%</div>
                <div className="text-sm text-[rgb(var(--color-text-muted))]">Customizable</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-500 mb-1">∞</div>
                <div className="text-sm text-[rgb(var(--color-text-muted))]">Node Types</div>
              </div>
            </div>
          </div>
          <div className="p-8 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-2xl">
            <div className="flex items-center justify-between gap-4 overflow-x-auto">
              <div className="flex flex-col items-center min-w-fit">
                <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center mb-2">
                  <span className="text-2xl">📋</span>
                </div>
                <span className="text-sm font-medium text-[rgb(var(--color-text))]">Planning</span>
              </div>
              <span className="text-2xl text-[rgb(var(--color-text-muted))]">→</span>
              <div className="flex flex-col items-center min-w-fit">
                <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center mb-2">
                  <span className="text-2xl">⚙️</span>
                </div>
                <span className="text-sm font-medium text-[rgb(var(--color-text))]">Development</span>
              </div>
              <span className="text-2xl text-[rgb(var(--color-text-muted))]">→</span>
              <div className="flex flex-col items-center min-w-fit">
                <div className="w-16 h-16 bg-pink-500/10 border border-pink-500/20 rounded-xl flex items-center justify-center mb-2">
                  <span className="text-2xl">✅</span>
                </div>
                <span className="text-sm font-medium text-[rgb(var(--color-text))]">Testing</span>
              </div>
              <span className="text-2xl text-[rgb(var(--color-text-muted))]">→</span>
              <div className="flex flex-col items-center min-w-fit">
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center mb-2">
                  <span className="text-2xl">🚀</span>
                </div>
                <span className="text-sm font-medium text-[rgb(var(--color-text))]">Deploy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Creative Writing Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="p-8 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-[rgb(var(--color-bg))]/50 rounded-xl text-center hover:scale-105 transition-transform">
                  <div className="text-4xl mb-2">👤</div>
                  <div className="text-sm font-medium text-[rgb(var(--color-text))]">Characters</div>
                </div>
                <div className="p-6 bg-[rgb(var(--color-bg))]/50 rounded-xl text-center hover:scale-105 transition-transform">
                  <div className="text-4xl mb-2">🗺️</div>
                  <div className="text-sm font-medium text-[rgb(var(--color-text))]">Locations</div>
                </div>
                <div className="p-6 bg-[rgb(var(--color-bg))]/50 rounded-xl text-center hover:scale-105 transition-transform">
                  <div className="text-4xl mb-2">📖</div>
                  <div className="text-sm font-medium text-[rgb(var(--color-text))]">Chapters</div>
                </div>
                <div className="p-6 bg-[rgb(var(--color-bg))]/50 rounded-xl text-center hover:scale-105 transition-transform">
                  <div className="text-4xl mb-2">⚔️</div>
                  <div className="text-sm font-medium text-[rgb(var(--color-text))]">Events</div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-500 font-medium">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              <span>For Creative Writers</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[rgb(var(--color-text))]">
              Build Worlds.<br/>
              Connect Stories.
            </h2>
            <p className="text-lg text-[rgb(var(--color-text-secondary))]">
              Craft characters, locations, and plot points as interconnected nodes.
              Visualize relationships, track story arcs, and discover hidden connections
              in your narrative universe.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500 mb-1">∞</div>
                <div className="text-sm text-[rgb(var(--color-text-muted))]">Characters</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500 mb-1">100%</div>
                <div className="text-sm text-[rgb(var(--color-text-muted))]">Your Canon</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500 mb-1">0</div>
                <div className="text-sm text-[rgb(var(--color-text-muted))]">Limitations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



