import { useEffect } from 'react';
import { Navigation } from '../components/layout/Navigation/Navigation';
import { Footer } from '../components/layout/Footer/Footer';
import { HeroSection } from '../components/landing/HeroSection/HeroSection';
import { BentoGrid } from '../components/landing/BentoGrid/BentoGrid';
import { DualPurpose } from '../components/landing/DualPurpose/DualPurpose';
import { PricingSection } from '../components/landing/PricingSection/PricingSection';
import { CTASection } from '../components/landing/CTASection/CTASection';
import './LandingPage.css';
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
    <>
      {/* Grain Texture Overlay */}
      <div className="grain"></div>
      {/* Mouse Glow Cursor */}
      <div id="mouse-glow"></div>

      <Navigation />

      <HeroSection />

      <BentoGrid />

      <DualPurpose />

      <PricingSection />

      <CTASection />

      <Footer />
    </>
  );
}
export default LandingPage;
