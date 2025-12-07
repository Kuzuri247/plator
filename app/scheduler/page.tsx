"use client";

import Link from "next/link";
import { ArrowLeft, CalendarClock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function SchedulerPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-lg w-full text-center space-y-8 bg-card/50 backdrop-blur-xl border border-border/50 p-8 md:p-12 rounded-2xl shadow-2xl"
      >
        {/* Icon */}
        <div className="flex justify-center relative">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20 relative z-10">
            <CalendarClock className="w-10 h-10 text-primary" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
            Scheduler <span className="text-primary">In Progress</span>
          </h1>
          <p className="text-muted-foreground font-manrope leading-relaxed">
            We are crafting a powerful scheduling engine to help you automate
            your posts across Twitter and LinkedIn. Also support for other
            platforms is in the works.
            <br className="hidden md:block" /> No more manual posting at 3 AM.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <ArrowLeft size={16} /> Return Home
            </Button>
          </Link>
          <Link href="/editor">
            <Button className="w-full sm:w-auto shadow-lg shadow-primary/20">
              Create Content Instead
            </Button>
          </Link>
        </div>

        <div className="pt-8 flex justify-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-xs font-medium border">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Under Development
          </span>
        </div>
      </motion.div>
    </div>
  );
}
