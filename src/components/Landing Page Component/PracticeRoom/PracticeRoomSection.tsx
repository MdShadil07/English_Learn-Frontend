import React from 'react';
import LeftContent from './LeftContent';
import SplineScene from './SplineScene';
import AmbientLighting from './AmbientLighting';
import FloatingParticles from './FloatingParticles';
import { BottomFeatureCards } from './FeatureCards';

const PracticeRoomSection = () => {
  return (
    <section className="bg-[#04060d] py-24 relative overflow-hidden font-sans">
      <div className="max-w-[1400px] mx-auto px-6 relative">
        
        {/* Main 3D Container with Glassmorphic Border */}
        <div className="relative rounded-[3rem] p-8 lg:p-12 border border-slate-800/60 bg-[#0a0f1c]/80 backdrop-blur-3xl shadow-2xl overflow-visible">
          
          <AmbientLighting />
          <FloatingParticles />

          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-8 relative z-10">
            {/* Left Column: Text & Features */}
            <LeftContent />

            {/* Right Column: 3D Spline Scene */}
            <div className="relative h-full flex items-center justify-center">
              <SplineScene />
            </div>
          </div>
        </div>

        {/* Bottom Horizontal Feature Cards */}
        <BottomFeatureCards />
        
      </div>
    </section>
  );
};

export default PracticeRoomSection;
