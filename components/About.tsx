import React from 'react';
import { ABOUT_CONTENT, EXPERIENCES } from '../constants';

const About: React.FC = () => {
  return (
    <section id="about" className="relative z-10 py-24 bg-black/40 backdrop-blur-sm border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h3 className="text-sm text-blue-400 font-bold uppercase tracking-widest mb-6">Über mich</h3>
            <p className="text-gray-300 leading-loose text-lg whitespace-pre-line">
              {ABOUT_CONTENT}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm text-blue-400 font-bold uppercase tracking-widest mb-6">Erfahrung</h3>
            <div className="space-y-8">
              {EXPERIENCES.map((exp) => (
                <div key={exp.id} className="border-l-2 border-white/10 pl-6 hover:border-blue-500 transition-colors duration-300">
                  <h4 className="text-xl font-semibold text-white">{exp.role}</h4>
                  <div className="flex justify-between items-center mt-1 mb-2">
                    <span className="text-gray-400">{exp.company}</span>
                    <span className="text-xs text-gray-500 font-mono">{exp.period}</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;