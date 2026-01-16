"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { LogIn, LogOut, Menu } from "lucide-react";
import { authClient } from "@/auth-client";
import { ThemeToggle } from "./theme-toggle";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";

const NAV_ITEMS = [
  { name: "Editor", href: "/editor" },
  { name: "Preview", href: "/preview" },
  { name: "Scheduler", href: "/scheduler", disabled: true },
];

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
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
          router.refresh();
        },
      },
    });
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md h-16 flex items-center transition-colors duration-300"
    >
      <div className="w-[90%] md:w-[80%] mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="font-bold text-xl tracking-tighter font-display uppercase flex items-center text-foreground hover:opacity-80 transition-opacity"
        >
          Pla<span className="text-primary">tor</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 text-xs font-medium uppercase tracking-widest">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.disabled ? "#" : item.href}
              onClick={(e) => {
                if (item.disabled) {
                  e.preventDefault();
                  toast.info("Coming Soon!");
                }
              }}
              className={cn(
                "transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-foreground font-bold"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
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
              <SheetContent className="flex flex-col p-0 gap-0">
                <SheetHeader className="text-left p-4 border-b border-border/50">
                  <Label className="uppercase tracking-tighter text-xl font-space font-semibold">
                    Pla<span className="text-primary">tor</span>
                  </Label>
                  <SheetDescription className="text-sm text-muted-foreground">
                    Navigation Menu
                  </SheetDescription>
                </SheetHeader>
                
                {/* Mobile Links */}
                <div className="flex flex-col gap-1 flex-1 p-4 overflow-y-auto">
                  {NAV_ITEMS.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <Link
                        href={item.disabled ? "#" : item.href}
                        onClick={(e) => {
                          if (item.disabled) {
                            e.preventDefault();
                            toast.info("Coming Soon!");
                          } else {
                            setIsOpen(false);
                          }
                        }}
                        className={cn(
                          "flex items-center w-full p-2 rounded-md text-lg font-semibold font-manrope transition-all",
                          pathname === item.href
                            ? "bg-primary/10 text-primary font-bold"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile Auth Button */}
                <div className="p-6 border-t border-border bg-muted/20 font-space">
                  {!session ? (
                    <Button
                      variant="outline"
                      className="w-full justify-center gap-3 h-11 text-md font-medium shadow-sm"
                      onClick={() => {
                        handleLogin();
                        setIsOpen(false);
                      }}
                    >
                      <LogIn size={16} /> Login
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full justify-center gap-3 h-11 text-md font-medium shadow-sm"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut size={16} /> Logout
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};