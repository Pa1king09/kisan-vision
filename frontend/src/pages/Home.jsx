import React from 'react';
import CommandCenterHero from '../components/home/HeroSection';
import IntelligenceStream from '../components/home/IntelligenceStream';
import BentoGridShowcase from '../components/home/BentoGridShowcase';
import AIPipeline from '../components/home/AIPipeline';
import SatelliteView from '../components/home/SatelliteView';
import ControlRoom from '../components/home/ControlRoom';
import VisionSection from '../components/home/VisionSection';
import CinematicCTA, { DarkFooter } from '../components/home/CTASection';

const Home = () => {
  return (
    <div className="bg-brand-bg min-h-screen relative overflow-hidden selection:bg-emerald-500/30 selection:text-white transition-colors duration-500">
      {/* Noise texture */}
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
      }} />

      {/* Cinematic Sections */}
      <CommandCenterHero />
      <IntelligenceStream />
      <BentoGridShowcase />
      <AIPipeline />
      <SatelliteView />
      <ControlRoom />
      <VisionSection />
      <CinematicCTA />
      <DarkFooter />
    </div>
  );
};

export default Home;
