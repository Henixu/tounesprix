"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "tounesprix_theme";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  window.localStorage.setItem(STORAGE_KEY, theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always start at "light" — the same assumption the server makes — so the
  // first client render matches the server-rendered HTML exactly (no
  // hydration mismatch). A blocking inline script (see app/layout.tsx)
  // already applied the real class to <html> before hydration, so the
  // page's actual colors are correct from first paint regardless; this
  // state only drives theme-aware UI (e.g. the toggle icon), which corrects
  // itself in the effect below immediately after mount.
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    setThemeState(document.documentElement.classList.contains("dark") ? "dark" : "light");

    if (window.localStorage.getItem(STORAGE_KEY)) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncWithSystem = (event: MediaQueryListEvent) => setThemeState(event.matches ? "dark" : "light");
    media.addEventListener("change", syncWithSystem);
    return () => media.removeEventListener("change", syncWithSystem);
  }, []);

  const isFirstRun = useRef(true);
  useEffect(() => {
    // Skip the mount run: the class is already correct (applied by the
    // blocking script), and re-applying here would just be redundant.
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);
  const toggleTheme = useCallback(() => setThemeState((current) => (current === "dark" ? "light" : "dark")), []);

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
