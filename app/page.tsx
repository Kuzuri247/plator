import { Hero } from "@/components/hero";
import { BentoGrid } from "@/components/bentogrid";
import { FAQ } from "@/components/faq";
import { Support } from "@/components/support";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { DitherCursor } from "@/components/landing/dither-cursor";

function App() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground transition-colors duration-300 flex flex-col relative overflow-hidden">
      <DitherCursor />
      <Navbar />
      <Hero />

      <BentoGrid />
      <FAQ />
      <Support />

      <Footer />
    </main>
  );
}

export default App;
