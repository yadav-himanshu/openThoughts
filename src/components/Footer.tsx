"use client";

import Link from "next/link";
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
    <footer className="mt-16 border-t border-theme bg-secondary">
      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-3">
        {/* Recent Posts */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-secondary">
            Recent Posts
          </h3>

          {recentPosts.length === 0 ? (
            <p className="text-sm text-secondary">No posts yet.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {recentPosts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/post/${post.id}`}
                    className="block truncate text-primary transition hover:underline"
                    title={post.title}
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* CTA Banner (Improved for dark & light) */}
        <div
          className="md:col-span-2 rounded-2xl
                     bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600
                     p-8 text-white flex flex-col gap-5
                     md:flex-row md:items-center md:justify-between
                     shadow-lg"
        >
          <p className="text-lg font-semibold leading-snug max-w-md">
            Have something meaningful to share?
            <br className="hidden sm:block" />
            Let your words inspire others.
          </p>

          <Link
            href="/submit"
            className="inline-flex items-center justify-center
                       rounded-full bg-white/90 px-6 py-2.5
                       text-sm font-semibold text-gray-900
                       transition hover:bg-white hover:scale-105"
          >
            ✍️ Post Your Story
          </Link>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-theme py-6 text-center text-xs text-secondary">
        © {year} OpenThoughts. All rights reserved.
      </div>
    </footer>
  );
}
