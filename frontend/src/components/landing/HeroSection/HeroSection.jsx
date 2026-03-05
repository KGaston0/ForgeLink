
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
    <section className="relative min-h-screen flex items-center justify-center px-8 py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div className="space-y-8 text-center lg:text-left z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-sm text-cyan-500 font-medium">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
            <span>Visual Knowledge Management</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[rgb(var(--color-text))] leading-tight">
            Build Your Ideas as{' '}
            <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
              Connected Networks
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-[rgb(var(--color-text-secondary))] max-w-2xl mx-auto lg:mx-0">
            ForgeLink transforms how you organize information. Create custom nodes, forge meaningful connections,
            and visualize your knowledge like never before—whether you're managing projects or building worlds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="btn-primary text-lg px-8 py-4">Start Free</button>
            <button className="btn-secondary text-lg px-8 py-4">Watch Demo</button>
          </div>
        </div>

        {/* Visual */}
        <div className="relative h-[400px] lg:h-[500px]">
          {/* Node Canvas */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 450 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Central Node */}
              <circle className="animate-pulse" cx="225" cy="200" r="40" fill="url(#gradient-cyan)" />
              {/* Surrounding Nodes */}
              <circle className="animate-pulse" style={{animationDelay: '0.1s'}} cx="100" cy="100" r="30" fill="url(#gradient-pink)" />
              <circle className="animate-pulse" style={{animationDelay: '0.2s'}} cx="350" cy="100" r="30" fill="url(#gradient-purple)" />
              <circle className="animate-pulse" style={{animationDelay: '0.3s'}} cx="100" cy="300" r="30" fill="url(#gradient-teal)" />
              <circle className="animate-pulse" style={{animationDelay: '0.4s'}} cx="350" cy="300" r="30" fill="url(#gradient-orange)" />
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
          <div className="absolute top-4 left-4 p-4 bg-[rgb(var(--color-bg-secondary))]/80 backdrop-blur-sm border border-[rgb(var(--color-border))] rounded-lg shadow-lg animate-bounce" style={{animationDuration: '3s', animationDelay: '0s'}}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <div className="text-xs text-[rgb(var(--color-text-muted))]">Project</div>
                <div className="font-semibold text-[rgb(var(--color-text))]">Sprint Planning</div>
              </div>
            </div>
          </div>

          <div className="absolute top-1/2 right-4 p-4 bg-[rgb(var(--color-bg-secondary))]/80 backdrop-blur-sm border border-[rgb(var(--color-border))] rounded-lg shadow-lg animate-bounce" style={{animationDuration: '3s', animationDelay: '0.5s'}}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎨</span>
              <div>
                <div className="text-xs text-[rgb(var(--color-text-muted))]">Creative</div>
                <div className="font-semibold text-[rgb(var(--color-text))]">World Building</div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/4 p-4 bg-[rgb(var(--color-bg-secondary))]/80 backdrop-blur-sm border border-[rgb(var(--color-border))] rounded-lg shadow-lg animate-bounce" style={{animationDuration: '3s', animationDelay: '1s'}}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔗</span>
              <div>
                <div className="text-xs text-[rgb(var(--color-text-muted))]">Connected</div>
                <div className="font-semibold text-[rgb(var(--color-text))]">12 Links</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


