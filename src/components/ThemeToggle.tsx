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
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900
                 shadow-2xl shadow-indigo-500/10 flex items-center justify-center transition-all hover:scale-110 active:scale-90"
    >
      <span className="text-xl">{dark ? "🌙" : "☀️"}</span>
    </button>
  );
}
