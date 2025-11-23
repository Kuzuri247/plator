import React from 'react';
import { Github, Twitter, Globe, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-background border-t border-border overflow-hidden pt-12 md:pt-16 pb-8">
      {/* 3D Perspective Grid Background - Top Origin - Constrained Height */}
      <div className="absolute inset-x-0 top-0 h-[300px] md:h-[400px] pointer-events-none overflow-hidden flex justify-center">
         <div 
            className="w-[150vw] h-full absolute top-0 bg-[size:50px_50px] opacity-[0.15]"
            style={{
                backgroundImage: 'linear-gradient(to right, oklch(var(--primary)) 1px, transparent 1px), linear-gradient(to bottom, oklch(var(--primary)) 1px, transparent 1px)',
                transform: 'perspective(500px) rotateX(60deg)',
                transformOrigin: 'top center',
                maskImage: 'linear-gradient(to bottom, black, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 100%)'
            }}
         />
      </div>

      <div className="w-[90%] md:w-[80%] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-foreground mb-4 font-display uppercase tracking-tight">
              Pla<span className="text-primary">tor</span>
            </h3>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed font-manrope">
              The all-in-one workspace for modern content creators.
              Design, Edit, Schedule, and Dominate your feed.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4 uppercase text-xs tracking-widest">Product</h4>
            <ul className="space-y-3 text-muted-foreground text-sm font-manrope">
              <li><a href="#" className="hover:text-foreground transition-colors">Templates</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Editor</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Scheduling</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4 uppercase text-xs tracking-widest">Connect</h4>
            <div className="flex flex-col gap-3 font-manrope">
              <a href="https://x.com/kuzuri247" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
                <Twitter size={16} /> Twitter (X)
              </a>
              <a href="https://github.com/Kuzuri247" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
                <Github size={16} /> GitHub
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
                <Globe size={16} /> Portfolio <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section - Clean Background Area */}
        <div className="font-inter pt-8 flex flex-col md:flex-row justify-center items-center gap-6 text-muted-foreground text-xs uppercase tracking-wider">
            <span>© {new Date().getFullYear()} PlateCreator Inc.</span>
            <span className="hidden md:block w-1 h-1 rounded-full bg-border"></span>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <span className="hidden md:block w-1 h-1 rounded-full bg-border"></span>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
};