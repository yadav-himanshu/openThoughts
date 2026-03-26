"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, Shield } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRef } from "react";


export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { user, isAdmin, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    setDropdownOpen(false);
  };

  if (!mounted || loading) return null;

  return (
    <header className="sticky top-0 z-[60] w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all group-hover:shadow-indigo-500/20 group-hover:shadow-lg flex items-center justify-center p-1">
            <img src="/icon.png" alt="OT" className="h-full w-full object-contain" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-500 to-purple-600 tracking-tighter">
              OpenThoughts
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-0.5">
              Collective
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          {[
            { label: "Feed", href: "/" },
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`px-6 py-2 text-sm font-bold uppercase tracking-widest transition-all rounded-xl ${pathname === item.href
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/submit"
            className="relative group px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-200 dark:shadow-none"
          >
            <span className="relative z-10 flex items-center gap-2">
              Create Story
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            </span>
          </Link>

          {!user ? (
            <Link
              href="/login"
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors"
            >
              Sign In
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50 hover:border-indigo-500/30 transition-all group"
              >
                <div className="h-8 w-8 rounded-full overflow-hidden bg-indigo-600 flex items-center justify-center border-2 border-white dark:border-slate-800">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="User" className="h-full w-full object-cover" />
                  ) : (
                    <UserIcon size={16} className="text-white" />
                  )}
                </div>
                <div className="flex flex-col items-start -space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white max-w-[80px] truncate">
                    {user.displayName?.split(' ')[0] || "User"}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Account</span>
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl shadow-indigo-500/10 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.displayName}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="mx-2 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all flex items-center gap-3 group"
                  >
                    <LayoutDashboard size={18} className="group-hover:text-indigo-500" />
                    User Dashboard
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="mx-2 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all flex items-center gap-3 group"
                    >
                      <Shield size={18} className="group-hover:text-indigo-500" />
                      Admin Console
                    </Link>
                  )}

                  <div className="mx-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all flex items-center gap-3 group"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {open && (
        <div ref={menuRef} className="lg:hidden absolute top-20 left-0 w-full h-screen bg-white dark:bg-slate-950 z-[55] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-1 p-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-4">Navigation</p>
            {[
              { label: "Timeline Feed", href: "/" },
              { label: "Our Story", href: "/about" },
              { label: "Get in Touch", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-4 py-4 text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-900/50 last:border-0 hover:text-indigo-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/submit"
              onClick={() => setOpen(false)}
              className="w-full py-4 text-center font-bold text-white bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/20 mb-2 mt-4"
            >
              Start Writing Now
            </Link>

            {!user ? (
              <div className="flex flex-col gap-4">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="w-full py-4 text-center font-bold text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-800 rounded-2xl"
                >
                  Join Community
                </Link>
              </div>
            ) : (
              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-900">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Account</p>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-4 font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 rounded-2xl"
                  >
                    <LayoutDashboard size={20} className="text-indigo-500" />
                    My Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-4 font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 rounded-2xl"
                    >
                      <Shield size={20} className="text-indigo-500" />
                      Admin Control
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-4 font-bold text-red-500 bg-red-50 dark:bg-red-500/5 rounded-2xl mt-4"
                  >
                    <LogOut size={20} />
                    Disconnect Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
