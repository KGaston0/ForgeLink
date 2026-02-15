
/**
 * CTASection Component - Final call-to-action
 */
export function CTASection() {
  return (
    <section className="py-24 px-8 bg-gradient-to-r from-cyan-500 to-purple-500 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Ready to <span className="underline decoration-white/30">Forge Your Links?</span>
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Start building your knowledge network today. No credit card required.
          Create unlimited custom nodes and connections from day one.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <button className="px-8 py-4 bg-white text-cyan-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-xl">
            Start Free Now
          </button>
          <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-all">
            Schedule Demo
          </button>
        </div>
        <p className="text-white/80 text-sm">
          Free forever. Upgrade when you need more.
        </p>
      </div>
    </section>
  );
}




