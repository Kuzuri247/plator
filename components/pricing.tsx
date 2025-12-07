"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { EtchingCorner } from "./patterns";

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
      <div
        className="pointer-events-none absolute -inset-px transition duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, oklch(var(--primary)/0.15), transparent 40%)`,
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
            <div className=" border-2 dark:border-neutral-800 px-8 py-4 md:px-12 md:py-6 bg-background/50 backdrop-blur-xl relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground font-display  uppercase tracking-tighter m-0 leading-none text-center">
                Unlock <span className="text-primary">Potential</span>
              </h2>
            </div>
            <EtchingCorner className="-top-px -left-px border-t border-l" />
            <EtchingCorner className="-top-px -right-px border-t border-r" />
            <EtchingCorner className="-bottom-px -right-px rotate-180 border-t border-l" />
            <EtchingCorner className="-bottom-px -left-px rotate-270 border-t border-l" />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="text-muted-foreground text-sm text-center max-w-xs font-manrope">
              Choose the plan that fits your workflow. No hidden fees.
            </p>

            <div className="h-8 w-px bg-border hidden md:block"></div>

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
          <SpotlightCard className="hover:scale-102 transition-transform duration-300 ease-in-out border-2 border-foreground/20 bg-card p-6 md:p-12 flex flex-col hover:border-foreground/30">
            <div className="mb-14 relative z-10">
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
                  <Check size={16} className="text-success" />
                  {item}
                </li>
              ))}
              {["Team Collaboration", "AI Magic Tools", "Custom Fonts"].map(
                (item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm text-muted-foreground/50 line-through decoration-border"
                  >
                    <X size={16} className="text-destructive" />
                    {item}
                  </li>
                ),
              )}
            </ul>

            <div className="relative z-10">
              <Button
                variant="outline"
                className="w-full hover:scale-103 transition-transform duration-300 ease-in-out"
              >
                Get Started
              </Button>
            </div>
          </SpotlightCard>

          <div className="relative group">
            <SpotlightCard className="relative z-20 flex flex-col p-6 hover:scale-102 transition-transform duration-300 ease-in-out border-2 md:p-12 border-primary/50 hover:border-primary/80 backdrop-blur-xl bg-background/50">
              <div className="relative z-20 mb-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold tracking-widest uppercase text-foreground">
                    Pro{" "}
                    <span className="px-2 py-0.5 bg-foreground text-background text-[10px]">
                      Popular
                    </span>
                  </div>
                </div>
                <div className="flex items-end gap-1 text-4xl font-bold font-display text-foreground">
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
                  <span className="text-lg font-normal text-muted-foreground">
                    /mo
                  </span>
                </div>
                <div className="h-4 mt-2 text-xs text-muted-foreground">
                  {isAnnual && "Billed $60 yearly"}
                </div>
              </div>

              <ul className="relative z-20 flex-1 mb-12 space-y-4">
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

              <div className="relative z-20">
                <Button
                  variant="primary"
                  className="w-full bg-primary/80 hover:bg-primary hover:scale-103 transition-transform duration-300 ease-in-out"
                >
                  Upgrade Now
                </Button>
              </div>
            </SpotlightCard>
            <div className="absolute inset-0 z-10 pointer-events-none">
              <EtchingCorner className="absolute -top-px size-4 -left-[0.5px] border-t border-l text-primary" />
              <EtchingCorner className="absolute -top-px -right-px rotate-90 border-t border-l text-primary" />
              <EtchingCorner className="absolute -bottom-px -left-[0.5px] -rotate-90 border-t border-l text-primary" />
              <EtchingCorner className="absolute -right-px -bottom-px rotate-180 border-t border-l text-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
