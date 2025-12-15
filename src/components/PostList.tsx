"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 🔹 NEW
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/* -----------------------------
   Types
------------------------------ */
type Post = {
  id: string;
  title: string;
  authorName: string;
  category: string;
  content: string;
  createdAt: Timestamp;
  approved: boolean;
};

type PostListProps = {
  fixedCategory?: string | null;
  fixedAuthor?: string | null;
};

const CATEGORIES = [
  "All",
  "Shayari",
  "Poems",
  "Short Stories",
  "Quotes",
  "Thoughts",
];

const PAGE_SIZE = 7;

export default function PostList({
  fixedCategory = null,
  fixedAuthor = null,
}: PostListProps) {
  const router = useRouter(); // 🔹 NEW

  const [posts, setPosts] = useState<Post[]>([]);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  /* -----------------------------
     Reset on Route Change
  ------------------------------ */
  useEffect(() => {
    setPosts([]);
    setLastDoc(null);
    setHasMore(true);
    fetchPosts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixedCategory, fixedAuthor]);

  /* -----------------------------
     Fetch Posts (UNCHANGED)
  ------------------------------ */
  const fetchPosts = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;

    setLoading(true);

    const constraints: QueryConstraint[] = [
      where("approved", "==", true),
      orderBy("createdAt", "desc"),
      limit(PAGE_SIZE),
    ];

    if (fixedCategory) {
      constraints.push(where("category", "==", fixedCategory));
    }

    if (fixedAuthor) {
      constraints.push(where("authorName", "==", fixedAuthor));
    }

    if (!reset && lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const q = query(collection(db, "posts"), ...constraints);
    const snapshot = await getDocs(q);

    const docs: Post[] = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Post, "id">),
    }));

    setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
    setHasMore(snapshot.docs.length === PAGE_SIZE);
    setPosts((prev) => (reset ? docs : [...prev, ...docs]));
    setLoading(false);
  };

  /* -----------------------------
     Client Filters (UNCHANGED)
  ------------------------------ */
  const filteredPosts = posts.filter((post) => {
    const matchCategory =
      fixedCategory || category === "All" || post.category === category;

    const matchAuthor =
      fixedAuthor ||
      post.authorName.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchAuthor;
  });

  /* -----------------------------
     UI (UPDATED)
  ------------------------------ */
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Filters */}
      {!fixedCategory && !fixedAuthor && (
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <select
            className="w-full md:w-64 rounded-md border border-theme bg-secondary
                       px-3 py-2 text-sm text-primary
                       focus:outline-none focus:ring-1 focus:ring-primary"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search by author name..."
            className="w-full md:w-72 rounded-md border border-theme bg-secondary
                       px-3 py-2 text-sm text-primary placeholder:text-secondary
                       focus:outline-none focus:ring-1 focus:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Posts */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => router.push(`/post/${post.id}`)} // 🔹 NEW
            className="rounded-xl border border-theme bg-secondary
                       p-5 transition hover:shadow-sm
                       cursor-pointer"
          >
            {/* Title */}
            <h2 className="text-lg font-semibold leading-snug">
              <Link
                href={`/post/${post.id}`}
                onClick={(e) => e.stopPropagation()} // 🔹 NEW
                className="hover:text-primary-hover transition"
              >
                {post.title}
              </Link>
            </h2>

            {/* Meta */}
            <div className="mt-1 text-sm text-secondary flex flex-wrap gap-1">
              <span>By</span>
              <Link
                href={`/author/${encodeURIComponent(post.authorName)}`}
                onClick={(e) => e.stopPropagation()} // 🔹 NEW
                className="font-medium text-primary hover:underline"
              >
                {post.authorName}
              </Link>
              <span>•</span>
              <Link
                href={`/category/${encodeURIComponent(post.category)}`}
                onClick={(e) => e.stopPropagation()} // 🔹 NEW
                className="hover:underline"
              >
                {post.category}
              </Link>
            </div>

            {/* Date */}
            <p className="mt-1 text-xs text-secondary">
              {post.createdAt?.toDate().toDateString()}
            </p>

            {/* Content Preview */}
            <p className="mt-4 text-sm text-secondary leading-relaxed">
              {post.content.slice(0, 60)}…
              <span className="ml-1 text-primary font-medium">
                Tap to read full post →
              </span>
            </p>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={() => fetchPosts()}
          disabled={loading || !hasMore}
          className="rounded-md border border-theme bg-secondary
                     px-6 py-2 text-sm text-primary
                     transition hover:bg-primary/10
                     disabled:opacity-50"
        >
          {loading ? "Loading..." : hasMore ? "Load More" : "No More Posts"}
        </button>
      </div>
    </div>
  );
}
