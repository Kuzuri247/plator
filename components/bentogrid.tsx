"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "motion/react";
import {
  LayoutTemplate,
  CalendarClock,
  Smartphone,
  Image as ImageIcon,
  Edit3,
  Move,
  Sparkles,
  Bold,
  Italic,
  Underline,
  ChevronUp,
  ChevronDown,
  Monitor,
  Wifi,
  TypeOutline,
} from "lucide-react";
import { BentoPattern } from "./patterns";

const BentoCard = ({
  children,
  className,
  delay = 0,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
}: {
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  onMouseMove?: React.MouseEventHandler;
  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay }}
    onMouseMove={onMouseMove}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={`relative overflow-hidden border-2 bg-card z-10 ${className}`}
  >
    {children}
  </motion.div>
);

const TiltCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;
    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        perspective: 1000,
      }}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

const TwinklingStars = () => {
  const stars = [
    { top: "10%", left: "20%", delay: 0 },
    { top: "30%", left: "80%", delay: 1.5 },
    { top: "50%", left: "50%", delay: 0.5 },
    { top: "70%", left: "10%", delay: 2 },
    { top: "80%", left: "70%", delay: 1 },
    { top: "20%", left: "90%", delay: 0.8 },
    { top: "60%", left: "30%", delay: 1.2 },
    { top: "40%", left: "60%", delay: 2.5 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_4px_white]"
          style={{ top: star.top, left: star.left }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export const BentoGrid = () => {
  const [editorStep, setEditorStep] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setEditorStep((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const [fontIndex, setFontIndex] = useState(0);
  const [activeStyles, setActiveStyles] = useState<string[]>([]);
  const [isCardHovered, setIsCardHovered] = useState(false);

  const fonts = [
    { name: "Inter", class: "font-sans" },
    { name: "Grotesk", class: "font-display" },
    { name: "Serif", class: "font-serif" },
    { name: "Mono", class: "font-mono" },
  ];

  const toggleStyle = (style: string) => {
    setActiveStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isCardHovered) return;

      if (e.key === "ArrowRight") {
        setFontIndex((prev) => (prev + 1) % fonts.length);
      } else if (e.key === "ArrowLeft") {
        setFontIndex((prev) => (prev - 1 + fonts.length) % fonts.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCardHovered, fonts.length]);

  const [currentMonth, setCurrentMonth] = useState(0);
  const months = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];

  const handleMonthChange = (direction: "up" | "down") => {
    setCurrentMonth((prev) => {
      if (direction === "up") return prev === 11 ? 0 : prev + 1;
      return prev === 0 ? 11 : prev - 1;
    });
  };

  const getCalendarDays = (monthIndex: number, year: number = 2025) => {
    const firstDay = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();

    const days = [];

    // Previous month
    for (let i = 0; i < firstDay; i++) {
      days.push({
        num: daysInPrevMonth - firstDay + i + 1,
        current: false,
        prev: true,
      });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ num: i, current: true, prev: false });
    }

    // Next month padding
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ num: i, current: false, prev: false });
    }

    return days;
  };

  const calendarDays = getCalendarDays(currentMonth);

  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">(
    "mobile"
  );

  return (
    <section className="w-full relative bg-background py-10 md:py-20">
      <BentoPattern />

      <div className="container w-[90%] md:w-[80%] lg:w-[75%] mx-auto relative z-20">
        <div className="mb-10 md:mb-16 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground font-display uppercase tracking-tight">
            Features for
            <br />
            <span className="text-primary">Modern Creators</span>
          </h2>
          <div className="h-1 w-20 bg-foreground mb-6" />
          <p className="text-muted-foreground text-sm md:text-base font-manrope">
            Everything you need to go from idea to published post in minutes.
            Minimalist tools for maximalist impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-4 gap-4 h-auto md:h-[850px] *:border-2 *:dark:border-neutral-700/90">
          <BentoCard className="md:col-span-4 md:row-span-2 flex flex-col p-5 md:p-8 hover:border-primary/30 transition-colors">
            <div className="absolute top-4 right-4 md:top-6 md:right-6 max-sm:hidden">
              <div className="flex items-center gap-2 px-2 py-1 bg-background/80 backdrop-blur border-2 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                </span>
                <span className="text-[10px] font-mono text-success uppercase tracking-wider">
                  System Online
                </span>
              </div>
            </div>

            <div className="relative z-10 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 border-2 bg-muted text-foreground">
                  <LayoutTemplate size={20} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-foreground font-display uppercase">
                  Smart Editor
                </h3>
              </div>
              <p className="text-muted-foreground max-w-md text-xs md:text-sm leading-relaxed font-manrope">
                Create with purpose. Seamlessly switch between modes.
              </p>
            </div>

            {/* Rotating Editor Visual */}
            <div className="flex-1 relative bg-muted/20 border-2 dark:border-neutral-800 overflow-hidden flex items-center justify-center min-h-[200px]">
              {/* Editor UI Shell */}
              <div className="absolute inset-4 border-2 dark:border-neutral-800 bg-card shadow-2xl flex flex-col">
                {/* Header */}
                <div className="h-8 border-b border-border flex items-center px-3 justify-between bg-muted/30">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    Editor_v2.0
                  </div>
                </div>

                {/* Dynamic Canvas Area */}
                <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-background">
                  <AnimatePresence mode="wait">
                    {editorStep === 0 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative w-3/4 h-3/4 bg-white p-6 shadow-lg flex flex-col gap-3 items-center justify-center  border-2"
                      >
                        <motion.h4
                          className="text-2xl md:text-3xl font-black font-display text-black uppercase tracking-tighter text-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          Bold Moves
                        </motion.h4>
                        <motion.p
                          className="text-[10px] text-neutral-500 text-center max-w-[80%] font-inter"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          Make an impact with our curated typography system.
                        </motion.p>
                      </motion.div>
                    )}

                    {editorStep === 1 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative w-3/4 h-3/4 bg-black border border-neutral-800 flex items-center justify-center overflow-hidden"
                      >
                        <motion.img
                          src="https://images.unsplash.com/photo-1605106702734-205df224ecce?q=80&w=800&auto=format&fit=crop"
                          className="w-full h-full object-cover opacity-60 grayscale"
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 2, ease: "easeOut" }}
                        />
                        <div className="absolute inset-0 border-[0.5px] border-white/20 grid grid-cols-3 grid-rows-3">
                          <div className="border-r border-b border-white/10"></div>
                          <div className="border-r border-b border-white/10"></div>
                          <div className="border-b border-white/10"></div>
                          <div className="border-r border-b border-white/10"></div>
                          <div className="border-r border-b border-white/10"></div>
                          <div className="border-b border-white/10"></div>
                          <div className="border-r border-white/10"></div>
                          <div className="border-r border-white/10"></div>
                        </div>
                      </motion.div>
                    )}

                    {editorStep === 2 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative w-3/4 h-3/4 flex items-center justify-center bg-black border border-neutral-800 overflow-hidden"
                      >
                        {/* Image Background - Always dark for 'magic' effect */}
                        <img
                          src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=1000&auto=format&fit=crop"
                          className="absolute inset-0 w-full h-full object-cover opacity-40"
                          alt="Space"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-linear-to-b from-black/20 to-black/80" />

                        {/* Twinkling Dots Effect */}
                        <TwinklingStars />

                        <div className="relative z-10 flex flex-col items-center">
                          <div className="animate-pulse">
                            <Sparkles size={24} className="text-white mb-2" />
                          </div>
                          <div className="text-xs text-white animate-pulse font-display uppercase tracking-widest">
                            Magic Effects
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer Tools */}
                <div className="h-10 border-t border-border flex items-center justify-around text-muted-foreground bg-muted/30">
                  <div
                    className={`flex items-center gap-1 transition-colors ${
                      editorStep === 0 ? "text-primary" : ""
                    }`}
                  >
                    <Edit3 size={10} />
                    <span className="text-[8px] uppercase hidden sm:inline font-manrope">
                      Typography
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1 transition-colors ${
                      editorStep === 1 ? "text-primary" : ""
                    }`}
                  >
                    <Move size={10} />
                    <span className="text-[8px] uppercase hidden sm:inline font-manrope">
                      Structure
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1 transition-colors ${
                      editorStep === 2 ? "text-primary" : ""
                    }`}
                  >
                    <Sparkles size={10} />
                    <span className="text-[8px] uppercase hidden sm:inline font-manrope">
                      Effects
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>

          <BentoCard
            className="md:col-span-2 md:row-span-2 p-5 md:p-8 flex flex-col items-center text-center justify-between bg-card hover:border-primary/30 transition-colors"
            delay={0.1}
            onMouseEnter={() => setIsCardHovered(true)}
            onMouseLeave={() => setIsCardHovered(false)}
          >
            <div className="w-full flex flex-col items-center">
              <div className="p-3 border-2 bg-muted text-foreground mb-6">
                <TypeOutline size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2 font-display uppercase text-foreground">
                Typography
              </h3>
              <p className="text-xs text-muted-foreground mb-8 uppercase tracking-widest font-manrope">
                {isCardHovered ? "Arrow Keys to Cycle" : "Hover to Interact"}
              </p>
            </div>

            {/* Main Display */}
            <div className="relative w-full flex-1 flex items-center justify-center bg-muted/20 border-2 dark:border-neutral-800 mb-4 overflow-hidden min-h-[120px]">
              <motion.div
                key={fontIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-3xl lg:text-4xl text-foreground transition-all duration-200 ${
                  fonts[fontIndex].class
                } 
                    ${activeStyles.includes("bold") ? "font-bold" : ""} 
                    ${activeStyles.includes("italic") ? "italic" : ""} 
                    ${activeStyles.includes("underline") ? "underline" : ""}
                  `}
              >
                Type
              </motion.div>
            </div>

            {/* Toolbar */}
            <div className="w-full flex items-center justify-between p-2 border-2 dark:border-neutral-800 bg-muted/30">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider px-2 border-r border-border min-w-[60px] text-center">
                {fonts[fontIndex].name}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => toggleStyle("bold")}
                  className={`p-1.5 rounded transition-colors ${
                    activeStyles.includes("bold")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Bold size={12} />
                </button>
                <button
                  onClick={() => toggleStyle("italic")}
                  className={`p-1.5 rounded transition-colors ${
                    activeStyles.includes("italic")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Italic size={12} />
                </button>
                <button
                  onClick={() => toggleStyle("underline")}
                  className={`p-1.5 rounded transition-colors ${
                    activeStyles.includes("underline")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Underline size={12} />
                </button>
              </div>
            </div>
          </BentoCard>

          {/* --- CARD 3: Smart Scheduler (3x2) --- */}
          <BentoCard
            className="md:col-span-3 md:row-span-2 p-5 md:p-8 flex flex-col bg-card hover:border-primary/30 transition-colors"
            delay={0.2}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 border-2 bg-muted text-foreground">
                  <CalendarClock size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display uppercase text-foreground">
                    Schedule
                  </h3>
                  <p className="text-xs text-muted-foreground font-manrope">
                    Auto-post magic.
                  </p>
                </div>
              </div>

              <div className="flex items-center border-2 dark:border-neutral-800 bg-muted/30">
                <button
                  onClick={() => handleMonthChange("down")}
                  className="p-2 hover:text-foreground text-muted-foreground transition-colors"
                >
                  <ChevronDown size={14} className="rotate-90" />
                </button>
                <div className="px-3 py-1 text-xs font-mono text-foreground border-x border-border min-w-[70px] md:min-w-20 text-center">
                  {months[currentMonth].substring(0, 3)}
                </div>
                <button
                  onClick={() => handleMonthChange("up")}
                  className="p-2 hover:text-foreground text-muted-foreground transition-colors"
                >
                  <ChevronUp size={14} className="rotate-90" />
                </button>
              </div>
            </div>

            {/* Calendar Visual */}
            <div className="flex-1 border-2 bg-muted/10 p-2 md:p-4 relative overflow-hidden flex flex-col min-h-[200px]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--border)/0.2)_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

              <div className="relative z-10 grid grid-cols-7 gap-1 h-full content-stretch">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <div
                    key={i}
                    className="text-[10px] text-muted-foreground text-center py-1 font-mono"
                  >
                    {d}
                  </div>
                ))}

                {calendarDays.map((day, i) => {
                  // Simple deterministic logic for demo
                  const isScheduled =
                    day.current && (day.num * (currentMonth + 2)) % 5 === 0;

                  return (
                    <div
                      key={i}
                      className={`
                           flex items-center justify-center relative group/day transition-colors min-h-6 rounded-sm
                           ${
                             day.current
                               ? "bg-transparent text-muted-foreground hover:bg-muted"
                               : "bg-transparent text-muted-foreground/20"
                           }
                           ${day.current && i % 2 !== 0 ? "bg-muted/20" : ""}
                        `}
                    >
                      <span
                        className={`text-[10px] ${
                          isScheduled ? "font-bold text-foreground" : ""
                        }`}
                      >
                        {day.num}
                      </span>

                      {day.current && isScheduled && (
                        <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-success rounded-full shadow-sm" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </BentoCard>

          {/* --- CARD 4: Cross-Platform Preview (3x2) --- */}
          <BentoCard
            className="md:col-span-3 md:row-span-2 p-5 md:p-8 flex flex-col bg-card hover:border-primary/30 transition-colors"
            delay={0.3}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 border-2 bg-muted text-foreground">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display uppercase text-foreground">
                    Live Preview
                  </h3>
                  <p className="text-xs text-muted-foreground font-manrope">
                    Pixel perfect.
                  </p>
                </div>
              </div>

              <div className="flex border-2 dark:border-neutral-800 bg-muted/30 p-0.5">
                <button
                  onClick={() => setPreviewMode("mobile")}
                  className={`p-2 transition-all duration-300 ${
                    previewMode === "mobile"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Smartphone size={14} />
                </button>
                <button
                  onClick={() => setPreviewMode("desktop")}
                  className={`p-2 transition-all duration-300 ${
                    previewMode === "desktop"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Monitor size={14} />
                </button>
              </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 bg-muted/20 border-2 flex items-center justify-center relative overflow-hidden py-6 perspective-container min-h-[250px]">
              <TiltCard className="w-full h-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={previewMode}
                    layout
                    initial={false}
                    animate={{
                      width: previewMode === "mobile" ? "140px" : "70%",
                      height: "100%",
                    }}
                    transition={{ type: "spring", stiffness: 180, damping: 20 }}
                    className="bg-background border-2 shadow-2xl flex flex-col overflow-hidden relative group/device mx-auto"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    {/* Mock Header */}
                    <div className="h-6 border-b border-border bg-muted/50 flex items-center px-2 gap-2 relative z-10 justify-between">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500/50"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50"></div>
                      </div>
                      <Wifi size={8} className="text-muted-foreground" />
                    </div>

                    {/* Mock Content with Infinite Scroll */}
                    <motion.div
                      className="flex-1 p-3 space-y-4"
                      animate={{ y: [-10, -50, -10] }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {/* Post 1 */}
                      <div className="flex gap-2 items-center opacity-80">
                        <div className="w-6 h-6 rounded-full bg-muted"></div>
                        <div className="space-y-1">
                          <div className="w-16 h-1.5 bg-muted rounded"></div>
                          <div className="w-8 h-1.5 bg-muted/50 rounded"></div>
                        </div>
                      </div>
                      <div className="w-full aspect-video bg-muted/30 rounded border-2 flex items-center justify-center overflow-hidden">
                        <ImageIcon
                          size={20}
                          className="text-muted-foreground"
                        />
                      </div>

                      {/* Post 2 */}
                      <div className="flex gap-2 items-center opacity-60 pt-2 border-t border-border">
                        <div className="w-6 h-6 rounded-full bg-muted"></div>
                        <div className="space-y-1">
                          <div className="w-20 h-1.5 bg-muted rounded"></div>
                        </div>
                      </div>
                      <div className="space-y-1.5 opacity-60">
                        <div className="w-full h-1.5 bg-muted rounded"></div>
                        <div className="w-[90%] h-1.5 bg-muted rounded"></div>
                      </div>

                      {/* Post 3 */}
                      <div className="w-full aspect-square bg-muted/30 rounded border-2 mt-2"></div>
                    </motion.div>

                    {/* Reflection Effect */}
                    <div className="absolute inset-0 bg-linear-to-tr from-white/5 to-transparent pointer-events-none z-20"></div>
                  </motion.div>
                </AnimatePresence>
              </TiltCard>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
};
