"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setMounted(true);
    });

    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  // 🚫 Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-theme bg-secondary/80 backdrop-blur">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg text-primary"
        >
          <span className="text-xl">📝</span>
          OpenThoughts
        </Link>

        {/* Center: Links */}
        <div className="hidden md:flex items-center gap-6 text-sm text-secondary">
          <Link href="/" className="hover:text-primary transition">
            Home
          </Link>
          <Link href="/about" className="hover:text-primary transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-primary transition">
            Contact
          </Link>

          {/* Language Filter */}
          <select
            className="rounded border border-theme bg-secondary px-2 py-1 text-sm
                       text-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="hi">Hindi</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* Right: Auth actions */}
        <div className="flex items-center gap-3">
          {!user ? (
            <Link
              href="/submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium
                         text-white transition hover:opacity-90"
            >
              Post Your Story
            </Link>
          ) : (
            <>
              <Link
                href="/admin/dashboard"
                className="text-sm font-medium text-primary hover:underline"
              >
                Admin
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-secondary hover:text-red-500 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
