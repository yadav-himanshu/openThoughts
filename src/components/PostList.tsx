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
import { Eye, Heart, User, Clock, ChevronRight } from "lucide-react";

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
  viewsCount?: number;
  likesCount?: number;
  slug?: string;
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

const PAGE_SIZE = 9;

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
    setPosts((prev) => (reset ? docs : [...prev, ...docs])); // Keeping load more for simplicity but ensuring 9 limit
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => router.push(`/post/${post.slug || post.id}`)}
            className="group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer overflow-hidden shadow-sm"
          >
            {/* Category Tag */}
            <div className="flex justify-between items-start mb-6">
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                {post.category}
              </span>
              <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-tighter">
                  <Eye size={14} className="text-slate-300 dark:text-slate-600" />
                  {post.viewsCount || 0}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-tighter">
                  <Heart size={14} className="text-slate-300 dark:text-slate-600" />
                  {post.likesCount || 0}
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 line-clamp-2 leading-tight tracking-tighter group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {post.title}
            </h2>

            {/* Content Preview */}
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-8 leading-relaxed italic font-serif">
              "{post.content.slice(0, 100)}..."
            </p>

            {/* Footer */}
            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <User size={14} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex flex-col -space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{post.authorName}</span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    <Clock size={10} />
                    {post.createdAt?.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
              <div className="h-9 w-9 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-700 transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600">
                <ChevronRight size={16} />
              </div>
            </div>
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
