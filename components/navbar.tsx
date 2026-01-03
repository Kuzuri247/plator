"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { LogIn, LogOut, Menu } from "lucide-react";
import { authClient } from "@/auth-client";
import { ThemeToggle } from "./theme-toggle";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

export const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const { data: session } = authClient.useSession();

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
          router.push("/");
        },
      },
    });
  };

  const NavLinks = () => (
    <>
      <a
        href="/editor"
        className="hover:text-foreground transition-colors"
        onClick={() => setIsOpen(false)}
      >
        Editor
      </a>
      <a
        href="/preview"
        className="hover:text-foreground transition-colors"
        onClick={() => setIsOpen(false)}
      >
        Preview
      </a>
      <a
        href="/"
        className="hover:text-foreground transition-colors"
        onClick={() => {
          setIsOpen(false);
          toast.info("Coming Soon!");
        }}
      >
        Scheduler
      </a>
    </>
  );

  return (
    <motion.nav
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md h-16 flex items-center transition-colors duration-300 animate-slide-down"
    >
      <div className="w-[90%] md:w-[80%] mx-auto flex justify-between items-center">
        <a
          href="/"
          className="font-bold text-xl tracking-tighter font-display uppercase flex items-center text-foreground"
        >
          Pla<span className="text-primary">tor</span>
        </a>

        <div className="hidden md:flex gap-8 text-xs font-medium text-muted-foreground uppercase tracking-widest">
          <NavLinks />
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          <div className="hidden md:block">
            {!session ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogin}
                className="gap-2 border-neutral-400 dark:border-neutral-700 text-yellow-500 dark:text-yellow-300 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/15 shadow-next dark:shadow-white/50"
              >
                <LogIn size={12} /> Login
              </Button>
            ) : (
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

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader className="text-left mb-8">
                  <SheetTitle className="font-display uppercase tracking-tighter text-xl">
                    Pla<span className="text-primary">tor</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 text-lg font-medium text-muted-foreground">
                  <NavLinks />
                  <div className="pt-6 border-t border-border mt-auto">
                    {!session ? (
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={handleLogin}
                      >
                        <LogIn size={16} /> Login
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} /> Logout
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};