import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-background/80 border-b border-border/40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8  rounded-lg flex items-center justify-center">
            <img src="/plate.svg" alt="Plater Logo" />
          </div>
          <a href="/" className="">
            <span className="font-bold text-2xl">Plater</span>
          </a>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="/meme-editor"
            className="text-muted-foreground hover:text-foreground transition-smooth"
          >
            Meme Editor
          </a>
          <a
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-smooth"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-muted-foreground hover:text-foreground transition-smooth"
          >
            Pricing
          </a>
          <a
            href="#about"
            className="text-muted-foreground hover:text-foreground transition-smooth"
          >
            About
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="ghost" className="hidden md:block">
            Sign In
          </Button>
          <Button className="bg-gradient-primary hover:shadow-purple transition-smooth">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}
