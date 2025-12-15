"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  /* -----------------------------
     Init theme (client only)
  ------------------------------ */
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored === "dark";

    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);

    setMounted(true);
  }, []);

  /* -----------------------------
     Toggle theme
  ------------------------------ */
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  // 🚫 Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="fixed bottom-6 right-6 z-50 rounded-full border border-theme bg-secondary
                 p-3 shadow-lg backdrop-blur transition hover:scale-105"
    >
      <span className="text-lg">{dark ? "🌙" : "☀️"}</span>
    </button>
  );
}
