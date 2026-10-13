import { useEffect } from 'react';
import { Navigation } from './components/Navigation/Navigation';
import { Footer } from './components/Footer/Footer';
import { HeroSection } from './components/HeroSection/HeroSection';
import { BentoGrid } from './components/BentoGrid/BentoGrid';
import { DualPurpose } from './components/DualPurpose/DualPurpose';
import { PricingSection } from './components/PricingSection/PricingSection';
import { CTASection } from './components/CTASection/CTASection';

function LandingPage() {
  useEffect(() => {
    // Mouse glow effect
    const mouseGlow = document.getElementById('mouse-glow');
    const handleMouseMove = (e) => {
      if (mouseGlow) {
        mouseGlow.style.left = e.clientX + 'px';
        mouseGlow.style.top = e.clientY + 'px';
        mouseGlow.style.opacity = '1';
      }
    };
    const handleMouseLeave = () => {
      if (mouseGlow) {
        mouseGlow.style.opacity = '0';
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Grain Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] z-10" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        backgroundRepeat: 'repeat'
      }}></div>

      {/* Mouse Glow Cursor */}
      <div id="mouse-glow" className="fixed w-96 h-96 rounded-full pointer-events-none opacity-0 transition-opacity duration-300 z-0" style={{
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
        transform: 'translate(-50%, -50%)'
      }}></div>

      <Navigation />

      <HeroSection />

      <BentoGrid />

      <DualPurpose />

      <PricingSection />

      <CTASection />

      <Footer />
    </div>
  );
}

export default LandingPage;
