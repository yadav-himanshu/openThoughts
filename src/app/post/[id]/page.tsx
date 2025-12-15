"use client";

import Comments from "@/components/Comments";
import DeleteRequestForm from "@/components/DeleteRequestForm";

import { useEffect, useState, use } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

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
  viewsCount: number;
  likesCount: number;
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function PostDetail({ params }: PageProps) {
  const { id } = use(params);

  const [post, setPost] = useState<Post | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -----------------------------
     Fetch Post (UNCHANGED)
  ------------------------------ */
  const fetchPost = async () => {
    const ref = doc(db, "posts", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const data = snap.data() as Omit<Post, "id">;

    setPost({
      id: snap.id,
      ...data,
    });

    await updateDoc(ref, {
      viewsCount: increment(1),
    });

    let likedPosts: string[] = [];
    try {
      likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
    } catch {
      likedPosts = [];
    }

    setLiked(likedPosts.includes(id));
  };

  /* -----------------------------
     Like Handler (UNCHANGED)
  ------------------------------ */
  const handleLike = async () => {
    if (!post || liked) return;

    const ref = doc(db, "posts", id);

    await updateDoc(ref, {
      likesCount: increment(1),
    });

    let likedPosts: string[] = [];
    try {
      likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
    } catch {
      likedPosts = [];
    }

    likedPosts.push(id);
    localStorage.setItem("likedPosts", JSON.stringify(likedPosts));

    setLiked(true);
    setPost({
      ...post,
      likesCount: post.likesCount + 1,
    });
  };

  /* -----------------------------
     UI
  ------------------------------ */
  if (!post) {
    return <p className="p-6 text-secondary">Loading...</p>;
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      {/* Title */}
      <h1 className="mb-4 text-3xl font-bold leading-tight">{post.title}</h1>

      {/* Meta */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-secondary">
        <span>By</span>
        <Link
          href={`/author/${encodeURIComponent(post.authorName)}`}
          className="font-medium text-primary hover:underline"
        >
          {post.authorName}
        </Link>
        <span>•</span>
        <Link
          href={`/category/${encodeURIComponent(post.category)}`}
          className="hover:underline"
        >
          {post.category}
        </Link>
      </div>

      {/* Date & views */}
      <p className="mb-6 text-xs text-secondary">
        {post.createdAt?.toDate().toDateString()} • {post.viewsCount} views
      </p>

      {/* Like Button */}
      <button
        onClick={handleLike}
        disabled={liked}
        className={`mb-10 inline-flex items-center gap-2 rounded-full
          border border-theme px-4 py-1.5 text-sm transition
          ${liked ? "opacity-60 cursor-not-allowed" : "hover:bg-primary/10"}`}
      >
        ❤️ {post.likesCount}
        <span className="hidden sm:inline">Like</span>
      </button>

      {/* Content */}
      <div
        className="prose prose-neutral dark:prose-invert max-w-none
                      whitespace-pre-line leading-relaxed"
      >
        {post.content}
      </div>

      {/* Comments */}
      <div className="mt-14 border-t border-theme pt-8">
        <Comments postId={id} />
      </div>

      {/* Delete Request */}
      <div className="mt-12">
        <DeleteRequestForm
          postTitle={post.title}
          authorName={post.authorName}
        />
      </div>
    </article>
  );
}
