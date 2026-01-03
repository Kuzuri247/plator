import { Hero } from "@/components/hero";
import { BentoGrid } from "@/components/bentogrid";
import { Footer } from "@/components/footer";
import { Pricing } from "@/components/pricing";
import { Navbar } from "@/components/navbar";

function App() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground transition-colors duration-300 flex flex-col gap-16 md:gap-32">
      <Navbar />
      <Hero />

      <div
        id="features"
        className="relative z-20 bg-background border-t border-b border-neutral-300 dark:border-neutral-800 transition-colors duration-300"
      >
        <BentoGrid />
      </div>

      <div id="pricing">
        <Pricing />
      </div>

      <Footer />
    </main>
  );
}

export default App;
