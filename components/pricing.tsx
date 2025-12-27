"use client";

import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { Check, Heart, Coffee, ArrowRight, QrCode } from "lucide-react";
import { Button } from "./ui/button";
import { EtchingCorner } from "./patterns";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

const SpotlightCard = ({
  children,
  className = "",
  onClick,
  spotlightColor = "oklch(var(--primary)/0.15)",
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  spotlightColor?: string;
}) => {
  const divRef = useRef<HTMLDivElement>(null);
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
      onClick={onClick}
      className={`relative overflow-hidden group ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 90%)`,
        }}
      />
      {children}
    </motion.div>
  );
};

export const Pricing: React.FC = () => {
  const [showQR, setShowQR] = useState(false);

  return (
    <section className="w-full py-20 relative">
      <div className="container w-[90%] md:w-[70%] lg:w-[50%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="relative mb-8">
            <div className="border-2 dark:border-neutral-800 px-8 py-4 md:px-12 md:py-6 bg-background/50 backdrop-blur-xl relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground font-display uppercase tracking-tighter m-0 leading-none text-center">
                Unleash <span className="text-primary ">Creativity</span>
              </h2>
            </div>
            <EtchingCorner className="-top-px -left-px border-t border-l" />
            <EtchingCorner className="-top-px -right-px border-t border-r" />
            <EtchingCorner className="-bottom-px -right-px rotate-180 border-t border-l" />
            <EtchingCorner className="-bottom-px -left-px rotate-270 border-t border-l" />
          </div>

          <p className="text-muted-foreground text-sm text-center max-w-md font-manrope">
            Plator is a passion project tailored for creators. No paywalls, no
            hidden fees—just pure creative potential.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative group h-full overflow-hidden p-0.5"
          >
            <SpotlightCard className="hover:scale-[1.01] transition-transform duration-300 ease-in-out border-2 border-primary/20 bg-card/50 backdrop-blur-sm p-6 md:p-8 flex flex-col h-full rounded-none">
              <div className="mb-6 relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-primary/10 text-primary px-3 py-1 text-sm font-bold uppercase tracking-wider rounded-full border border-primary/20">
                    All Access
                  </div>
                </div>
                <div className="text-5xl font-display font-bold text-foreground mb-2">
                  $0
                </div>
                <p className="text-muted-foreground text-sm font-manrope">
                  Get the full "Pro" experience without spending a dime.
                </p>
              </div>

              <div className="w-full h-px bg-border mb-6" />

              <ul className="space-y-4 mb-8 flex-1 relative z-10 font-inter">
                {[
                  "Unlimited Templates",
                  "4K Ultra-HD Exports",
                  "Mutliple styles",
                  "3d Support",
                  "No Watermark",
                  "Preview Modes",
                  "Schedule Posts(upcoming)",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm text-foreground/90 font-medium"
                  >
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Check size={12} className="text-green-500" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="relative z-10 mt-auto">
                <Button
                  asChild
                  className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-bold tracking-wide"
                >
                  <Link href="/editor">
                    Start Creating Now <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
              </div>
            </SpotlightCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="relative group h-full overflow-hidden p-0.5"
          >
            {/* Rotating Conic Gradient Layer */}
            <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#4285F4_0%,#EA4335_25%,#FBBC05_50%,#34A853_75%,#4285F4_100%)] opacity-100" />

            <SpotlightCard
              spotlightColor="rgba(255, 255, 255, 0.1)"
              className="relative z-10 h-full bg-white dark:bg-black/95 p-6 md:p-8 flex flex-col"
            >
              <div className="relative z-20 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#4285F4] dark:text-[#4285F4]">
                    Support the Dev
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-display font-bold mb-2">
                  <span className="text-foreground">Fuel the</span> <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#FBBC05]">
                    Revolution
                  </span>
                </div>
              </div>

              <div className="relative z-20 flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-900/80 rounded-lg border border-neutral-200 dark:border-white/5 p-4 mb-6 text-center">
                {showQR ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center"
                  >
                    <Image
                      src="/qr.png"
                      alt="Google Pay QR Code"
                      width={180}
                      height={180}
                      className="rounded-lg mb-3 border-2 border-neutral-300 dark:border-neutral-700"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowQR(false)}
                      className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mt-2"
                    >
                      Hide QR
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    <Image
                      src="/pfp.jpg"
                      alt="Profile Picture"
                      width={50}
                      height={50}
                      className="text-white fill-white rounded-full pb-2"
                    />

                    <h3 className="text-neutral-900 dark:text-white font-bold text-lg mb-1">
                      Buy me a Coffee
                    </h3>
                    <p className="text-xs font-inter text-neutral-500 dark:text-neutral-500 mb-4">
                      via UPI / QR
                    </p>

                    <div className="text-xs font-inter text-neutral-700 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-800 px-4 py-2 rounded-full select-all border border-neutral-300 dark:border-white/10 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors cursor-pointer mb-3">
                      rs4515080@okaxis
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowQR(true)}
                      className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    >
                      <QrCode size={14} className="mr-2" />
                      Show QR Code
                    </Button>
                  </>
                )}
              </div>

              <div className="relative z-20 mt-auto">
                <Button
                  variant="outline"
                  className="w-full h-12 border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white bg-transparent hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white"
                  onClick={() => {
                    navigator.clipboard.writeText("rs4515080@okaxis");
                    toast.success("UPI ID copied to clipboard");
                  }}
                >
                  <Coffee size={16} className="mr-2 text-[#FBBC05]" />
                  Copy UPI ID
                </Button>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
