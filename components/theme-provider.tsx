"use client";

import { useEffect } from "react";
import { applyTheme, getStoredTheme, getSystemTheme } from "@/lib/theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyTheme(getStoredTheme() ?? getSystemTheme());
  }, []);

  return children;
}
