"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
      className="relative p-2 rounded-full hover:bg-foreground/5 transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
      aria-label="Basculer le thème"
    >
      {/* Sun — visible in light mode, hidden in dark */}
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
      {/* Moon — hidden in light mode, visible in dark */}
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground inset-0 m-auto" />
    </button>
  );
}
