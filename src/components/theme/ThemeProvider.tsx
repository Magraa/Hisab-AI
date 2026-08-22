"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_THEME, isThemeId, type ThemeId } from "@/lib/themes";

const STORAGE_KEY = "hisab_theme";

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);

  useEffect(() => {
    // ThemeScript already applied data-theme to <html> before paint (from
    // localStorage). Just sync this context's state to match it once we're
    // mounted, so the Settings picker highlights the right option.
    const current = document.documentElement.getAttribute("data-theme");
    if (isThemeId(current)) setThemeState(current);
  }, []);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeState(id);
    document.documentElement.setAttribute("data-theme", id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // storage unavailable, theme just won't persist across reloads
    }
  }, []);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
