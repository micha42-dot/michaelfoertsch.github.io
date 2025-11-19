import React from 'react';
import { PROJECTS } from '../constants';

const Work: React.FC = () => {
  return (
    <section id="work" className="relative z-10 py-24 bg-neutral-900/30 border-t border-white/5">
      <div className="container mx-auto px-6">
        <h3 className="text-sm text-blue-400 font-bold uppercase tracking-widest mb-12">Ausgewählte Arbeiten</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project) => (
            <a 
              key={project.id}
              href={project.link}
              className="group block p-8 bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-white/20"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h4>
                <svg 
                  className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors transform group-hover:translate-x-1 group-hover:-translate-y-1" 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </div>
              
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="text-xs font-mono text-gray-500 bg-black/30 px-2 py-1 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;