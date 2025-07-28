import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';

export function Header() {
  return (
    <nav className="fixed top-0 w-full z-50 py-2 ">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <img
              src="/plate.svg"
              alt="Plater Logo"
              className="invert dark:invert-0 transition-colors"
            />
          </div>
          <a href="/" className="">
            <span className="font-bold text-2xl">Plater</span>
          </a>
        </div>

        <div className="hidden md:flex items-center gap-8 font-medium text-lg">
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

          <Button className="bg-gradient-primary hover:shadow-purple transition-smooth">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}
