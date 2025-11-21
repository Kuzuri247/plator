"use client";

import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="size-[1.2rem] rounded border border-border animate-pulse" />
    );
  }

  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <Button
      onClick={() => setTheme(nextTheme)}
      className="relative size-9 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Sun className={`h-[1.2rem] w-[1.2rem] rotate-0`} />
      ) : (
        <Moon className={`h-[1.2rem] w-[1.2rem] rotate-0 `} />
      )}
    </Button>
  );
}
