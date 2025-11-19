import React from 'react';
import { SOCIALS } from '../constants';

const Contact: React.FC = () => {
  return (
    <footer id="contact" className="relative z-10 py-24 bg-black border-t border-white/10">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">
          Lass uns etwas zusammen erschaffen.
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto mb-12">
          Ich bin derzeit für freie Projekte verfügbar. Wer über KI reden möchte oder ein Projekt im Sinn hat, kann mich einfach anschreiben.
        </p>
        
        <a 
          href="mailto:hello@michaelfoertsch.de"
          className="inline-block px-8 py-4 border border-white text-white hover:bg-white hover:text-black transition-all duration-300 text-lg tracking-wide mb-16"
        >
          Kontakt aufnehmen
        </a>

        <div className="flex justify-center space-x-8">
          {SOCIALS.map((social) => (
            <a 
              key={social.platform} 
              href={social.url} 
              target="_blank" 
              rel="noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
            >
              {social.platform}
            </a>
          ))}
        </div>
        
        <div className="mt-24 text-xs text-gray-700">
          © {new Date().getFullYear()} Michael Förtsch. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
};

export default Contact;