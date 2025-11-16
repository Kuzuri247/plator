import { ThemeToggle } from './theme-toggle';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 py-2">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center">
            <img
              src="/plate.svg"
              alt="Plater Logo"
              className="invert dark:invert-0 transition-colors"
            />
          </div>
          <a href="/">
            <span className="font-semibold text-2xl">Plater</span>
          </a>
        </div>

        <div className="hidden md:flex items-center gap-8 font-medium text-[17px]">
          <a
            href="/meme-editor"
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
            href="#pricing"
            className="text-neutral-600 dark:text-muted-foreground hover:text-foreground dark:hover:text-slate-100 transition-smooth"
          >
            Scheduler
          </a>
          <a
            href="#about"
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
