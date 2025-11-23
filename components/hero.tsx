import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";
import { XPost, LinkedInPost, InstagramPost } from "./posts";
import { ScalePattern } from "./patterns";

export const Hero = ({ children }: { children: React.ReactNode }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setActiveSlide((prev) => (prev + 1) % 3);
  //   }, 4000);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <section className="relative w-full md:w-[80%] mx-auto min-h-[85vh] md:min-h-[90vh] flex items-center justify-center pt-24 pb-10 bg-background">
      <div className="relative z-10 h-full w-full flex flex-col justify-center">
        {/* Cool Tech Corners */}
        <div className="absolute -top-3 -left-3 w-8 h-8 border-t-4 border-l-4 border-foreground z-30" />
        <div className="absolute -top-3 -right-3 w-8 h-8 border-t-4 border-r-4 border-foreground z-30" />
        <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-4 border-l-4 border-foreground z-30" />
        <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-4 border-r-4 border-foreground z-30" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-2 bg-background w-full shadow-2xl relative z-20">
          {/* Left Column: Content with Scale Pattern */}
          <div className="relative p-6 md:p-12 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-border overflow-hidden min-h-[450px] lg:min-h-[600px]">
            <ScalePattern />

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-block mb-6 px-3 py-1 border border-border text-muted-foreground text-xs uppercase tracking-widest bg-background/50 backdrop-blur-sm"
              >
                v1.0 Launch Soon
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tighter leading-[0.9] text-foreground font-display uppercase"
              >
                Everything
                <br /><span className="text-primary/95">In A Plate</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base md:text-lg text-muted-foreground mb-10 leading-relaxed max-w-md font-light font-manrope"
              >
                Transform content creation with meme templates, stylish text
                integration, and smart post scheduling.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Button size="md" variant="primary" className="bg-primary/80 hover:bg-primary hover:scale-103 transition-transform duration-300 ease-in-out">
                  Start Creating Free
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Right Column: Rotating Social Mocks */}
          <div className="relative min-h-[400px] lg:min-h-[600px] bg-background flex items-center justify-center overflow-hidden p-6 md:p-8">
            {/* Simple Grid Background for Right Column */}
            <div
              className="absolute inset-0 mask-radial-fade pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(oklch(var(--border)/0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(var(--border)/0.5) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            <div className="relative z-10 w-full max-w-md flex flex-col items-center">
              <AnimatePresence mode="wait">
                {activeSlide === 0 && (
                  <motion.div
                    key="x-container"
                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                    transition={{ duration: 0.5 }}
                    className="w-full flex flex-col gap-2"
                  >
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">
                      Twitter / X
                    </div>
                    <XPost />
                  </motion.div>
                )}
                {activeSlide === 1 && (
                  <motion.div
                    key="linkedin-container"
                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                    transition={{ duration: 0.5 }}
                    className="w-full flex flex-col items-start gap-2"
                  >
                    <div className="text-xs font-bold uppercase tracking-widest text-[#0A66C2] pl-1">
                      LinkedIn
                    </div>
                    <LinkedInPost />
                  </motion.div>
                )}
                {activeSlide === 2 && (
                  <motion.div
                    key="instagram-container"
                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                    transition={{ duration: 0.5 }}
                    className="w-full flex flex-col items-start gap-2"
                  >
                    <div className="text-xs font-bold uppercase tracking-widest bg-linear-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] bg-clip-text text-transparent pl-1">
                      Instagram
                    </div>
                    <InstagramPost />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
