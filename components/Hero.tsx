import React from 'react';
import { HERO_CONTENT } from '../constants';

const Hero: React.FC = () => {
  return (
    <section className="relative z-10 min-h-screen flex flex-col justify-center px-6 pointer-events-none">
      <div className="container mx-auto flex justify-start">
        {/* Constrain width to strictly the left 5/12 (slightly less than half) on large screens to give way to the animation */}
        <div className="w-full lg:w-5/12 pr-4">
          <p className="text-sm md:text-base text-blue-400 mb-4 tracking-widest uppercase animate-fade-in-up font-mono">
            {HERO_CONTENT.greeting}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tighter animate-fade-in-up animation-delay-100 leading-tight">
            {HERO_CONTENT.name}
          </h1>
          <h2 className="text-2xl md:text-4xl text-gray-400 mb-8 font-light animate-fade-in-up animation-delay-200">
            {HERO_CONTENT.role}
          </h2>
          <p className="text-lg text-gray-500 max-w-md leading-relaxed animate-fade-in-up animation-delay-300">
            {HERO_CONTENT.tagline}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;