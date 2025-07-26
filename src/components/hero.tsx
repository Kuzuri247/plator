import { Button } from "./ui/button";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24 bg-gradient-hero">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto font-inter tracking-tighter">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Everything in a{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Plate
            </span>
            <br />
            Create with Style
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed text-wrap">
            Transform your content creation with meme templates, stylish text
            integration, and smart post scheduling.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-primary dark:bg-gradient-primary-dark hover:shadow-purple transition text-lg px-8 py-6 hover:-translate-y-1 ease-in-out duration-200"
            >
              <p>Start Creating Free</p>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-neutral-200 dark:bg-neutral-800 border-white/20 hover:bg-white/10 dark:hover:bg-white/10 transition-smooth text-lg px-8 py-6"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
