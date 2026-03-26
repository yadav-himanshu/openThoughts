"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Github, Twitter, Instagram, Mail, ArrowRight } from "lucide-react";

/* -----------------------------
   Types
------------------------------ */
type Post = {
  id: string;
  title: string;
  slug?: string;
};

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [year, setYear] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  /* -----------------------------
     Client-only logic
  ------------------------------ */
  useEffect(() => {
    setYear(new Date().getFullYear());

    const fetchRecentPosts = async () => {
      try {
        const q = query(
          collection(db, "posts"),
          where("approved", "==", true),
          orderBy("createdAt", "desc"),
          limit(4),
        );

        const snapshot = await getDocs(q);

        const posts: Post[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          slug: doc.data().slug,
        }));

        setRecentPosts(posts);
      } catch (error) {
        console.error("Failed to load recent posts", error);
      } finally {
        setMounted(true);
      }
    };

    fetchRecentPosts();
  }, []);

  // 🚫 Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <footer className="mt-24 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 transition-transform group-hover:scale-110 flex items-center justify-center p-1">
                <img src="/icon.png" alt="OT" className="h-full w-full object-contain" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-500 to-purple-600">
                OpenThoughts
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              The premier platform for authentic storytelling. Share your shayari, poems, and deep reflections with a community that values words over noise.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Github, href: "#" },
                { icon: Mail, href: "mailto:info@openthoughts.com" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-500 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">
              Platform
            </h4>
            <ul className="space-y-4">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Post a Story", href: "/submit" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                    <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700 transition-all group-hover:w-2 group-hover:bg-indigo-500"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Content */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">
              Latest Reads
            </h4>
            <div className="space-y-4">
              {recentPosts.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No posts yet.</p>
              ) : (
                recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/post/${post.slug || post.id}`}
                    className="block group"
                  >
                    <p className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 font-medium">
                      {post.title}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Newsletter / CTA */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-indigo-500/5 dark:bg-indigo-400/5 border border-indigo-500/10 dark:border-indigo-400/10">
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-2">Join the Collective</p>
              <p className="text-slate-600 dark:text-slate-500 text-sm max-w-xs mb-4">
                A premium sanctuary for thoughts, stories, and human expression.
              </p>
              {subscribed ? (
                <div className="py-2 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold animate-in fade-in zoom-in duration-300">
                  ✨ Welcome to the collective!
                </div>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }}
                  className="space-y-3"
                >
                  <input
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                  <button type="submit" className="w-full flex items-center justify-between px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                    Subscribe
                    <ArrowRight size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            © {year} OpenThoughts Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-slate-500 hover:text-indigo-500">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-slate-500 hover:text-indigo-500">Terms of Service</Link>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Live Status: OK
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
