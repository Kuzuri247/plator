"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Menu, Sparkles } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";

const NAV_ITEMS = [
  { name: "Editor", href: "/editor" },
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/#pricing" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md h-16 flex items-center transition-colors duration-300"
    >
      <div className="w-[90%] md:w-[80%] mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="font-bold text-xl tracking-tighter font-display uppercase flex items-center text-foreground hover:opacity-80 transition-opacity"
        >
          Pla<span className="text-primary">tor</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 text-xs font-medium uppercase tracking-widest">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-foreground font-bold"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          <div className="hidden md:block">
            <Link href="/editor">
              <Button
                variant="primary"
                size="sm"
                className="gap-2 font-semibold uppercase tracking-wider text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-next"
              >
                <Sparkles size={14} /> Open Editor
              </Button>
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent className="flex flex-col p-0 gap-0">
                <SheetHeader className="text-left p-4 border-b border-border/50">
                  <Label className="uppercase tracking-tighter text-xl font-space font-semibold">
                    Pla<span className="text-primary">tor</span>
                  </Label>
                  <SheetDescription className="text-sm text-muted-foreground">
                    Navigation Menu
                  </SheetDescription>
                </SheetHeader>
                
                {/* Mobile Links */}
                <div className="flex flex-col gap-1 flex-1 p-4 overflow-y-auto">
                  {NAV_ITEMS.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center w-full p-2 rounded-md text-lg font-semibold font-manrope transition-all",
                          pathname === item.href
                            ? "bg-primary/10 text-primary font-bold"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile CTA */}
                <div className="p-6 border-t border-border bg-muted/20 font-space">
                  <Link href="/editor" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="primary"
                      className="w-full justify-center gap-3 h-11 text-md font-semibold bg-primary text-primary-foreground shadow-sm uppercase tracking-wide"
                    >
                      <Sparkles size={16} /> Open Editor
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};