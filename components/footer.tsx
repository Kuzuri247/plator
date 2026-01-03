import React from "react";
import { Github, Twitter, Globe, ExternalLink } from "lucide-react";
import { FooterPattern } from "./patterns";

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-background border-t border-border overflow-hidden pt-10 md:pt-16 pb-8">
      <FooterPattern />

      <div className="w-[90%] md:w-[80%] mx-auto relative z-10 px-4 md:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-8 md:mb-12">
          <div className="col-span-1 sm:col-span-2 md:col-span-2">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4 font-display uppercase tracking-tight">
              Pla<span className="text-primary">tor</span>
            </h3>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed font-manrope">
              The all-in-one workspace for modern content creators. Design,
              Edit, Schedule, and Dominate your feed.
            </p>
          </div>

          <div className="mt-2 md:mt-0">
            <h4 className="font-bold text-foreground mb-3 md:mb-4 uppercase text-xs tracking-widest">
              Product
            </h4>
            <ul className="space-y-2 md:space-y-3 text-muted-foreground text-sm font-manrope">
              <li>
                <a
                  href="/editor"
                  className="hover:text-foreground transition-colors"
                >
                  Editor
                </a>
              </li>
              <li>
                <a
                  href="/preview"
                  className="hover:text-foreground transition-colors"
                >
                  Preview
                </a>
              </li>
              <li>
                <a
                  href="/scheduler"
                  className="hover:text-foreground transition-colors"
                >
                  Scheduler
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-foreground transition-colors scroll-smooth"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div className="mt-2 md:mt-0">
            <h4 className="font-bold text-foreground mb-3 md:mb-4 uppercase text-xs tracking-widest">
              Connect
            </h4>
            <div className="flex flex-col gap-2 md:gap-3 font-manrope">
              <a
                href="https://x.com/kuzuri247"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                <Twitter size={16} /> Twitter (X)
              </a>
              <a
                href="https://github.com/Kuzuri247"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                <Github size={16} /> GitHub
              </a>
              <a
                href="https://github.com/Kuzuri247"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                <Globe size={16} /> Portfolio <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        <div className="font-inter pt-6 md:pt-8 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 text-muted-foreground text-[10px] md:text-xs uppercase tracking-wider text-center border-t border-border/50 md:border-none">
          <span>© {new Date().getFullYear()} Plator</span>
          <span className="hidden md:block w-1 h-1 rounded-full bg-border"></span>
          <span>Made with ❤️ by Kuzuri247</span>
        </div>
      </div>
    </footer>
  );
};