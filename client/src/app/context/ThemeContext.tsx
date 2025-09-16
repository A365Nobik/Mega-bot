import React, { createContext, useState, useEffect } from "react";

interface ProviderProps {
  children?: React.ReactNode;
}
type Theme = "light" | "dark" | "system";
interface ContextValue {
  theme: Theme;
  setTheme: (next: Theme) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext<ContextValue>({
  theme: "system",
  setTheme: () => {},
});

export const ThemeProvider: React.FC<ProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || "system"
  );
  useEffect(() => {
    localStorage.setItem("theme", theme);
    const body = document.body;

    const applyTheme = (theme: string) => {
      body.classList.remove("light", "dark");
      body.classList.add(theme);
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
  }, [theme]);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
