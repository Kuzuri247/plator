"use client";

import { Hero } from "@/components/hero";
import { BentoGrid } from "@/components/bentogrid";
import { Footer } from "@/components/footer";
import { Pricing } from "@/components/pricing";
import { ThemeToggle } from "@/components/theme-toggle";
import { ReactLenis } from "lenis/react";
import { authClient } from "@/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

function App() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/"); // Redirect to home
        },
      },
    });
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground transition-colors duration-300 flex flex-col gap-16 md:gap-32">
      <ReactLenis root />
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md h-16 flex items-center transition-colors duration-300">
        <div className="w-[90%] md:w-[80%] mx-auto flex justify-between items-center">
          <div className="font-bold text-xl tracking-tighter font-display uppercase flex items-center text-foreground">
            Pla<span className="text-primary">tor</span>
          </div>
          <div className="hidden md:flex gap-8 text-xs font-medium text-muted-foreground uppercase tracking-widest">
            <a
              href="/editor"
              className="hover:text-foreground transition-colors"
            >
              Editor
            </a>
            <a
              href="/preview"
              className="hover:text-foreground transition-colors"
            >
              Preview
            </a>
            <a
              href="/scheduler"
              className="hover:text-foreground transition-colors"
            >
              Scheduler
            </a>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {!session && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogin}
                className="gap-2 border-neutral-400 dark:border-neutral-700 text-yellow-500 dark:text-yellow-300 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/15 shadow-next dark:shadow-white/50"
              >
                <LogIn size={12} /> Login
              </Button>
            )}

            {session && (
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="gap-2 border-neutral-400 dark:border-neutral-700 text-yellow-500 dark:text-yellow-300 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/15 shadow-next dark:shadow-white/50"
              >
                <LogOut size={12} /> Logout
              </Button>
            )}
          </div>
        </div>
      </nav>

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
