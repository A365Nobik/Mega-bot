"use client";

import { createContext, useState, useEffect } from "react";

interface ProviderProps {
  children?: React.ReactNode;
}

type Theme = "light" | "dark" | "system";

interface ContextValue {
  theme: Theme;
  setTheme: (next: Theme) => void;
}

export const ThemeContext = createContext<ContextValue>({
  theme: "system",
  setTheme: () => {},
});

const allowedThemes: Theme[] = ["system", "dark", "light"];

export const ThemeProvider: React.FC<ProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme && allowedThemes.includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, [mounted]);

  useEffect(() => {
    if (!theme || !mounted) return;

    localStorage.setItem("theme", theme);
    const body = document.body;

    const applyTheme = (t: Theme) => {
      body.classList.remove("light", "dark");
      body.classList.add(t);
    };

    if (theme === "system") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const systemDark = mql.matches ? "dark" : "light";
      applyTheme(systemDark);

      const listener = (event: MediaQueryListEvent) =>
        applyTheme(event.matches ? "dark" : "light");
      mql.addEventListener("change", listener);
      return () => mql.removeEventListener("change", listener);
    } else {
      applyTheme(theme);
    }
  }, [theme, mounted]);
  if (!mounted) {
    return <div className="contents">{children}</div>;
  }
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
