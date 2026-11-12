/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  showLabel = false,
}) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return (
      document.documentElement.classList.contains("dark") ||
      document.documentElement.getAttribute("data-theme") === "dark"
    );
  });

  useEffect(() => {
    // Synchronize initial state with DOM attribute set by anti-FOUC script
    const currentTheme = document.documentElement.getAttribute("data-theme");
    setIsDark(currentTheme === "dark" || document.documentElement.classList.contains("dark"));

    // Listen to system color scheme changes if user hasn't explicitly overridden
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      try {
        const stored = localStorage.getItem("sovra_theme");
        if (!stored) {
          applyTheme(e.matches ? "dark" : "light");
        }
      } catch (err) {
        applyTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const applyTheme = (theme: "dark" | "light") => {
    const isDarkTheme = theme === "dark";
    setIsDark(isDarkTheme);

    if (isDarkTheme) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }

    try {
      localStorage.setItem("sovra_theme", theme);
    } catch (e) {
      console.warn("Unable to save theme preference to localStorage:", e);
    }
  };

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    applyTheme(nextTheme);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] cursor-pointer select-none ${className}`}
    >
      <span className="relative flex items-center justify-center w-4 h-4">
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-[var(--accent)] transition-transform duration-200" aria-hidden="true" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-[var(--accent)] transition-transform duration-200" aria-hidden="true" />
        )}
      </span>
      {showLabel && (
        <span className="font-medium tracking-tight">
          {isDark ? "Dark" : "Light"}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
