"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { Sparkles, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import StackIcon from "tech-stack-icons";

const NAV_ITEMS = [
  { name: "Features", href: "/#features" },
  { name: "FAQ", href: "/#faq" },
  { name: "Support", href: "/#support" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (current) => {
    const prev = lastScrollY.current;
    const diff = current - prev;

    // Only hide after scrolling past 80px and moving downwards by more than 5px
    if (current > 80 && diff > 5) {
      setIsHidden(true);
    } else if (diff < -5 || current <= 80) {
      setIsHidden(false);
    }

    lastScrollY.current = current;
  });

  return (
    <motion.header
      initial={{ opacity: 0, y: -40 }}
      animate={{
        opacity: isHidden ? 0 : 1,
        y: isHidden ? -80 : 0,
      }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
    >
      <nav
        className="pointer-events-auto w-full max-w-5xl flex items-center justify-between px-3 sm:px-5 py-2 rounded-lg border border-border/70 bg-background/80 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/25 transition-colors"
      >
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-1.5 font-bold text-lg tracking-tight uppercase text-foreground hover:opacity-85 transition-opacity pl-1"
        >
          <span>
            Pla<span className="text-primary font-extrabold">tor</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 text-xs">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-3.5 text-sm font-medium font-manrope transition-all duration-200",
                  isActive
                    ? "bg-background text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Actions & CTA */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="flex items-center justify-center">
            <ThemeToggle classname=""/>
          </div>

          <a
            href="https://github.com/Kuzuri247"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex"
          >
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 rounded-lg px-3 h-8 text-xs font-semibold font-manrope border-border/80 hover:bg-muted text-foreground shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all duration-50 cursor-pointer"
            >
              <div className="size-3.5 flex items-center justify-center dark:invert transition-[filter]">
                <StackIcon name="github" className="w-full h-full" />
              </div>
              <span>GitHub</span>
            </Button>
          </a>

          {/* Mobile Navigation Trigger */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-full hover:bg-muted"
                  aria-label="Toggle navigation menu"
                >
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="top"
                className="mx-auto mt-4 w-[92%] max-w-md rounded-3xl border border-border bg-background/95 backdrop-blur-2xl p-5 shadow-2xl"
              >
                <SheetHeader className="text-left pb-3 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg uppercase tracking-tight">
                      Pla<span className="text-primary">tor</span>
                    </span>
                  </div>
                  <SheetDescription className="text-xs text-muted-foreground font-manrope">
                    Visual Mockups & WebGL Shader Studio
                  </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-1.5 py-4">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-2.5 rounded-2xl text-sm font-medium font-manrope transition-colors",
                        pathname === item.href
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Link href="/editor" onClick={() => setIsOpen(false)}>
                    <Button className="w-full rounded-2xl h-11 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md gap-2">
                      <Sparkles className="size-4" /> Open Studio
                    </Button>
                  </Link>
                  <a
                    href="https://github.com/Kuzuri247"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button variant="outline" className="w-full rounded-2xl h-10 text-xs font-semibold border-border gap-2">
                      <div className="size-3.5 flex items-center justify-center dark:invert transition-[filter]">
                        <StackIcon name="github" className="w-full h-full" />
                      </div>
                      <span>Star on GitHub</span>
                    </Button>
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </motion.header>
  );
};