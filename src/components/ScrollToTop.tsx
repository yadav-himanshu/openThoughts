"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`
        fixed right-6 z-40
        bottom-24
        h-14 w-14 rounded-full border border-slate-200 dark:border-slate-800
        bg-white dark:bg-slate-900 shadow-2xl shadow-indigo-500/10 
        flex items-center justify-center
        transition-all duration-300 ease-out
        hover:scale-110 active:scale-95
        ${visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6 pointer-events-none"
        }
      `}
    >
      <span className="text-indigo-600 dark:text-indigo-400">
        <ArrowUp size={24} />
      </span>
    </button>
  );
}
