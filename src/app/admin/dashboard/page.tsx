"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* -----------------------------
   Types
------------------------------ */
type Post = {
  id: string;
  title: string;
  authorName: string;
  category: string;
  language: string;
  content: string;
  approved: boolean;
};

/* -----------------------------
   Status Filter
------------------------------ */
type StatusFilter = "all" | "pending" | "approved";

export default function AdminDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("all");

  /* -----------------------------
     Auth check (UNCHANGED)
  ------------------------------ */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin/login");
      } else {
        fetchAllPosts();
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  /* -----------------------------
     Fetch all posts (UNCHANGED)
  ------------------------------ */
  const fetchAllPosts = async () => {
    const q = query(collection(db, "posts"), orderBy("approved", "asc"));
    const snapshot = await getDocs(q);

    const result: Post[] = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Post, "id">),
    }));

    setPosts(result);
  };

  /* -----------------------------
     Actions (UNCHANGED)
  ------------------------------ */
  const approvePost = async (id: string) => {
    await updateDoc(doc(db, "posts", id), {
      approved: true,
    });
    fetchAllPosts();
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return;
    await deleteDoc(doc(db, "posts", id));
    fetchAllPosts();
  };

  /* -----------------------------
     Filtered posts
  ------------------------------ */
  const filteredPosts = posts.filter((post) => {
    if (filter === "pending") return !post.approved;
    if (filter === "approved") return post.approved;
    return true;
  });

  /* -----------------------------
     UI
  ------------------------------ */
  if (loading) {
    return <p className="p-6 text-secondary">Checking auth...</p>;
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-secondary">
            Manage posts, approvals, and edits
          </p>
        </div>

        {/* <button
          onClick={() => signOut(auth)}
          className="text-sm text-secondary hover:text-red-500 transition"
        >
          Logout
        </button> */}
      </div>

      {/* Filter */}
      <div className="mb-8">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as StatusFilter)}
          className="rounded-md border border-theme bg-secondary
                     px-3 py-2 text-sm text-primary
                     focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Posts</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      {/* Posts */}
      {filteredPosts.length === 0 ? (
        <p className="text-secondary">No posts found.</p>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="rounded-xl border border-theme bg-secondary p-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold leading-snug">{post.title}</h2>
                  <p className="mt-1 text-sm text-secondary">
                    By {post.authorName} • {post.category} • {post.language}
                  </p>
                </div>

                {/* Status */}
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium
                    ${
                      post.approved
                        ? "bg-primary/10 text-primary"
                        : "bg-yellow-500/10 text-yellow-600"
                    }`}
                >
                  {post.approved ? "Approved" : "Pending"}
                </span>
              </div>

              {/* Content preview */}
              <p className="mt-4 line-clamp-2 text-sm text-secondary">
                {post.content}
              </p>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/post/${post.id}`}
                  target="_blank"
                  className="rounded-md border border-theme bg-transparent
                             px-4 py-1.5 text-sm text-primary
                             transition hover:bg-primary/10"
                >
                  View
                </Link>

                {!post.approved && (
                  <button
                    onClick={() => approvePost(post.id)}
                    className="rounded-md bg-primary px-4 py-1.5
                               text-sm text-white transition hover:opacity-90"
                  >
                    Approve
                  </button>
                )}

                {post.approved && (
                  <Link
                    href={`/admin/edit/${post.id}`}
                    className="rounded-md border border-theme
                               px-4 py-1.5 text-sm
                               transition hover:bg-primary/10"
                  >
                    Edit
                  </Link>
                )}

                <button
                  onClick={() => deletePost(post.id)}
                  className="rounded-md border border-theme
                             px-4 py-1.5 text-sm text-red-500
                             transition hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
