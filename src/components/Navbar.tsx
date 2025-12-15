"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Menu, X } from "lucide-react";
import logo from "../../public/logoOT.png";
import Image from "next/image";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setMounted(true);
    });

    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
  };

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 bg-secondary/80 backdrop-blur border-b border-theme">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-primary"
        >
          <Image
            src={logo}
            alt="OpenThoughts logo"
            // width={200}
            height={60}
            priority
            className="rounded-sm"
          />
          {/* <span className="tracking-tight">OpenThoughts</span> */}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm text-secondary">
          <Link href="/" className="hover:text-primary transition">
            Home
          </Link>
          <Link href="/about" className="hover:text-primary transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-primary transition">
            Contact
          </Link>

          {/* <select
            className="rounded-md border border-theme bg-secondary px-2 py-1
                       text-sm text-primary focus:outline-none"
          >
            <option value="hi">Hindi</option>
            <option value="en">English</option>
          </select> */}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <Link
              href="/submit"
              className="rounded-full bg-primary px-5 py-2
                         text-sm font-medium text-white
                         transition hover:opacity-90"
            >
              ✍️ Let Your Thoughts Speak
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-primary"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-theme bg-secondary">
          <div className="flex flex-col gap-4 px-4 py-5 text-sm">
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link href="/about" onClick={() => setOpen(false)}>
              About
            </Link>
            <Link href="/contact" onClick={() => setOpen(false)}>
              Contact
            </Link>

            {/* <select className="rounded-md border border-theme bg-secondary px-2 py-1">
              <option value="hi">Hindi</option>
              <option value="en">English</option>
            </select> */}

            {!user ? (
              <Link
                href="/submit"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-primary px-4 py-2
                           text-center text-white"
              >
                ✍️ Let Your Thoughts Speak
              </Link>
            ) : (
              <>
                <Link href="/admin/dashboard" onClick={() => setOpen(false)}>
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-red-500"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
