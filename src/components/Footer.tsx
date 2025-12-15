"use client";

import Link from "next/link";
import logo from "../../public/logoOT.png"
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

/* -----------------------------
   Types
------------------------------ */
type Post = {
  id: string;
  title: string;
};

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [year, setYear] = useState<number | null>(null);

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
    <footer className="mt-20 bg-secondary border-t border-theme">
      {/* Top Section */}
      <div className="max-w-6xl mx-auto px-4 py-14 grid gap-12 md:grid-cols-4">
        {/* Brand */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={logo} // 👈 place logo in /public/logo.png
              alt="OpenThoughts logo"
              // width={40}
              height={50}
              className="rounded-lg"
            />
            {/* <span className="text-xl font-semibold text-primary">
              OpenThoughts
            </span> */}
          </Link>

          <p className="text-sm text-secondary max-w-md leading-relaxed">
            OpenThoughts is a space for honest words, meaningful stories,
            and ideas worth sharing. Write freely, read deeply, and let
            thoughts travel beyond screens.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-secondary">
            Explore
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/" className="hover:text-primary transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-primary transition">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary transition">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/submit" className="hover:text-primary transition">
                Submit a Story
              </Link>
            </li>
          </ul>
        </div>

        {/* Recent Posts */}
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-secondary">
            Recent
          </h4>

          {recentPosts.length === 0 ? (
            <p className="text-sm text-secondary">No posts yet.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {recentPosts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/post/${post.id}`}
                    className="block truncate hover:text-primary transition"
                    title={post.title}
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* CTA Strip (Unique Footer Touch) */}
      <div className="mx-4 mb-10 rounded-2xl bg-linear-to-r from-slate-900 via-slate-800 to-slate-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg font-medium">
            ✍️ Your thoughts matter.
            <span className="block text-sm text-slate-300">
              Share something meaningful today.
            </span>
          </p>

          <Link
            href="/submit"
            className="inline-flex items-center justify-center
                       rounded-full bg-white px-6 py-2.5
                       text-sm font-semibold text-slate-900
                       transition hover:bg-slate-100 hover:scale-105"
          >
            Start Writing
          </Link>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-theme py-6 text-center text-xs text-secondary">
        © {year} OpenThoughts · Built for thinkers & storytellers
      </div>
    </footer>
  );
}
