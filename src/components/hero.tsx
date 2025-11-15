import { Button } from './ui/button';
import { Github } from 'lucide-react';

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0 dark:bg-black bg-white">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
              radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
              radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
              radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
              transparent
            `,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight tracking-[-0.05em] bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-violet-400 to-amber-600">
            Everything in a Plate
            <br />
            Create with ease
          </h1>

          <p className="text-xl md:text-2xl text-neutral-700 dark:text-neutral-300 mb-8 max-w-2xl mx-auto leading-relaxed tracking-tight">
            Transform your content creation with meme templates, stylish text
            integration, and smart post scheduling.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
 className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all text-lg px-8 py-6 hover:-translate-y-1 ease-in-out duration-200"
>            
              Start Creating Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex items-center gap-4 bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-black dark:text-white transition-all text-lg px-8 py-6"
            >
              <span>Github</span>
              <Github className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
