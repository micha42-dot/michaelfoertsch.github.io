import React from 'react';
import Navbar from './components/Navbar';
import ParticleAnimation from './components/ParticleAnimation';
import Hero from './components/Hero';
import About from './components/About';
import Work from './components/Work';
import Contact from './components/Contact';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500 selection:text-white">
      <Navbar />
      
      {/* 3D Background - Fixed position, behind content */}
      <ParticleAnimation />
      
      {/* Content - Relative position, scrolls over the canvas */}
      <main className="relative">
        <Hero />
        <div className="bg-[#050505]/80 backdrop-blur-[2px]">
            <About />
            <Work />
            <Contact />
        </div>
      </main>
    </div>
  );
};

export default App;