"use client";

import React, { useState, useEffect } from "react";
import { Hero } from "@/components/hero";
import { BentoGrid } from "@/components/bentogrid";
import { Footer } from "@/components/footer";
import { Pricing } from "@/components/pricing";
import { Moon, Sun } from "lucide-react";

function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground transition-colors duration-300 flex flex-col gap-16 md:gap-32">
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md h-16 flex items-center transition-colors duration-300">
        <div className="w-[90%] md:w-[80%] mx-auto flex justify-between items-center">
          <div className="font-bold text-xl tracking-tighter font-display uppercase flex items-center text-foreground">
            Pla<span className="text-primary">tor</span>
          </div>
          <div className="hidden md:flex gap-8 text-xs font-medium text-muted-foreground uppercase tracking-widest">
            <a
              href="/editor"
              className="hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Showcase
            </a>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="text-muted-foreground hover:text-foreground transition-colors p-2"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="bg-foreground text-background hover:bg-muted-foreground hover:text-white px-5 py-2 text-xs font-bold uppercase tracking-wide transition-colors rounded-none">
              Log In
            </button>
          </div>
        </div>
      </nav>

      <Hero />

      <div className="relative z-20 bg-background border-t border-border transition-colors duration-300">
        <BentoGrid />
      </div>

      <Pricing />

      <Footer />
    </main>
  );
}

export default App;
