"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "./ui/button";

const EtchingCorner = ({ className }: { className?: string }) => (
  <div className={`absolute w-4 h-4 border-muted-foreground/50 ${className}`}>
    {/* Decorative Etchings */}
    <div className="absolute w-full h-px bg-muted-foreground/50 top-0 left-0"></div>
    <div className="absolute h-full w-px bg-muted-foreground/50 top-0 left-0"></div>
    <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-foreground"></div>
  </div>
);

// --- Spotlight Card Component ---
const SpotlightCard = ({
  children,
  className = "",
  onClick,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={onClick}
      className={`relative overflow-hidden group ${className}`}
    >
      {/* Spotlight Gradient */}
      <div
        className="pointer-events-none absolute -inset-px transition duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, oklch(var(--primary)/0.15), transparent 40%)`,
        }}
      />
      {children}
    </motion.div>
  );
};

export const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className="w-full py-20 relative">
      <div className="container w-[90%] md:w-[70%] lg:w-[50%] mx-auto">
        <div className="flex flex-col items-center mb-20">
          <div className="relative mb-8">
            <div className=" border-2 px-8 py-4 md:px-12 md:py-6 bg-background/50 backdrop-blur-sm relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground font-display uppercase tracking-tighter m-0 leading-none text-center">
                Unlock Potential
              </h2>
            </div>
            <EtchingCorner className="-top-px -left-px border-t border-l" />
            <EtchingCorner className="-bottom-px -right-px rotate-180 border-t border-l" />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="text-muted-foreground text-sm text-center max-w-xs">
              Choose the plan that fits your workflow. No hidden fees.
            </p>

            <div className="h-8 w-px bg-border hidden md:block"></div>

            {/* Toggle */}
            <div className="flex items-center gap-1 bg-muted/50  border-2 p-1">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  !isAnnual
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  isAnnual
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Tier */}
          <SpotlightCard className=" border-2 bg-card p-6 md:p-12 flex flex-col hover:border-foreground/30 transition-colors">
            <div className="mb-8 relative z-10">
              <div className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2">
                Starter
              </div>
              <div className="text-4xl font-display font-bold text-foreground">
                $0
                <span className="text-lg text-muted-foreground font-normal">
                  /mo
                </span>
              </div>
            </div>

            <ul className="space-y-4 mb-12 flex-1 relative z-10">
              {[
                "3 Projects",
                "Basic Templates",
                "720p Exports",
                "Community Support",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <Check size={16} className="text-succes" />
                  {item}
                </li>
              ))}
              {["Team Collaboration", "AI Magic Tools", "Custom Fonts"].map(
                (item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm text-muted-foreground/50 line-through decoration-border"
                  >
                    <X size={16} className="text-muted-foreground/50" />
                    {item}
                  </li>
                )
              )}
            </ul>

            <div className="relative z-10">
              <Button variant="outline" className="w-full">
                Get Started
              </Button>
            </div>
          </SpotlightCard>

          {/* Premium Tier */}
          <SpotlightCard className="border-2 border-primary/20 bg-linear-to-b from-card to-muted/20 p-6 md:p-12 flex flex-col hover:border-primary/50 transition-colors duration-500">
            {/* Cool Etchings / Corner Accents */}
            <EtchingCorner className="top-0 left-0 border-t border-l" />
            <EtchingCorner className="top-0 right-0 rotate-90 border-t border-l" />
            <EtchingCorner className="bottom-0 left-0 -rotate-90 border-t border-l" />
            <EtchingCorner className="bottom-0 right-0 rotate-180 border-t border-l" />

            <div className="mb-8 relative z-10">
              <div className="flex justify-between items-start">
                <div className="text-foreground text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                  Pro{" "}
                  <span className="px-2 py-0.5 bg-foreground text-background text-[10px]">
                    Popular
                  </span>
                </div>
              </div>
              <div className="text-4xl font-display font-bold text-foreground flex items-end gap-1">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isAnnual ? "year" : "month"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    ${isAnnual ? "5" : "10"}
                  </motion.span>
                </AnimatePresence>
                <span className="text-lg text-muted-foreground font-normal">
                  /mo
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-2 h-4">
                {isAnnual && "Billed $228 yearly"}
              </div>
            </div>

            <ul className="space-y-4 mb-12 flex-1 relative z-10">
              {[
                "Unlimited Projects",
                "Premium Templates",
                "4K Exports",
                "Priority Support",
                "Team Collaboration",
                "AI Magic Tools",
                "Custom Fonts",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm text-foreground"
                >
                  <Check size={16} className="text-success" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="relative z-10">
              <Button variant="primary" className="w-full">
                Upgrade Now
              </Button>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
};
