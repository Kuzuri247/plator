"use client";

import { CalendarHeartIcon } from "@phosphor-icons/react";
import { ThemeToggle } from "./theme-toggle";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-[90%] inset-x-0 top-0 z-50 mx-auto mt-2 flex items-center justify-between  font-jakarta">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="rounded-lg flex items-center justify-center">
            <CalendarHeartIcon size={32} />
          </div>
          <a href="/">
            <span className="font-semibold text-2xl font-jakarta">Plater</span>
          </a>
        </div>

        <div className="hidden md:flex items-center gap-8 font-medium text-[17px] font-jakarta">
          <a
            href="/editor"
            className="text-neutral-600 dark:text-muted-foreground hover:text-foreground dark:hover:text-slate-100 transition-smooth"
          >
            Editor
          </a>
          <a
            href="/style-text"
            className="text-neutral-600 dark:text-muted-foreground hover:text-foreground dark:hover:text-slate-100 transition-smooth"
          >
            Texter
          </a>
          <a
            href="/"
            className="text-neutral-600 dark:text-muted-foreground hover:text-foreground dark:hover:text-slate-100 transition-smooth"
          >
            Scheduler
          </a>
          <a
            href="/"
            className="text-neutral-600 dark:text-muted-foreground hover:text-foreground dark:hover:text-slate-100 transition-smooth"
          >
            About
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <a
              href="/meme-editor"
              className="text-lg font-medium text-neutral-600 dark:text-muted-foreground hover:text-foreground dark:hover:text-slate-100 transition-smooth py-2"
              onClick={() => setIsOpen(false)}
            >
              Editor
            </a>
            <a
              href="/style-text"
              className="text-lg font-medium text-neutral-600 dark:text-muted-foreground hover:text-foreground dark:hover:text-slate-100 transition-smooth py-2"
              onClick={() => setIsOpen(false)}
            >
              Texter
            </a>
            <a
              href="#pricing"
              className="text-lg font-medium text-neutral-600 dark:text-muted-foreground hover:text-foreground dark:hover:text-slate-100 transition-smooth py-2"
              onClick={() => setIsOpen(false)}
            >
              Scheduler
            </a>
            <a
              href="#about"
              className="text-lg font-medium text-neutral-600 dark:text-muted-foreground hover:text-foreground dark:hover:text-slate-100 transition-smooth py-2"
              onClick={() => setIsOpen(false)}
            >
              About
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
