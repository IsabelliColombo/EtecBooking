"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import {
  applyTheme,
  getActiveTheme,
  getThemeServerSnapshot,
  subscribeToTheme,
  type Theme,
} from "@/lib/theme";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getActiveTheme,
    getThemeServerSnapshot,
  );

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    applyTheme(next);
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={theme === "dark"}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      onClick={toggle}
      className={cn(
        "relative inline-flex h-10 w-[4.5rem] shrink-0 items-center rounded-full border border-border bg-surface-2 p-1",
        "transition-all duration-150 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <Sun
        className={cn(
          "absolute left-2.5 size-4 text-warning transition-opacity duration-150",
          theme === "dark" ? "opacity-40" : "opacity-100",
        )}
        aria-hidden
      />
      <Moon
        className={cn(
          "absolute right-2.5 size-4 text-info transition-opacity duration-150",
          theme === "light" ? "opacity-40" : "opacity-100",
        )}
        aria-hidden
      />
      <span
        className={cn(
          "pointer-events-none flex size-8 items-center justify-center rounded-full bg-surface shadow-sm",
          "transition-transform duration-150 ease-in-out",
          theme === "dark" ? "translate-x-8" : "translate-x-0",
        )}
      >
        {theme === "dark" ? (
          <Moon className="size-4 text-foreground" aria-hidden />
        ) : (
          <Sun className="size-4 text-foreground" aria-hidden />
        )}
      </span>
    </button>
  );
}
