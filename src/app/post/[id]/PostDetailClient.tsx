"use client";

import Comments from "@/components/Comments";
import DeleteRequestForm from "@/components/DeleteRequestForm";
import { useEffect, useState } from "react";
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

export default function PostDetailClient({ id }: { id: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPost = async () => {
    const ref = doc(db, "posts", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const data = snap.data() as Omit<Post, "id">;

    setPost({ id: snap.id, ...data });

    await updateDoc(ref, {
      viewsCount: increment(1),
    });

    let likedPosts: string[] = [];
    try {
      likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
    } catch {}

    setLiked(likedPosts.includes(id));
  };

  const handleLike = async () => {
    if (!post || liked) return;

    const ref = doc(db, "posts", id);
    await updateDoc(ref, {
      likesCount: increment(1),
    });

    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
    likedPosts.push(id);
    localStorage.setItem("likedPosts", JSON.stringify(likedPosts));

    setLiked(true);
    setPost({ ...post, likesCount: post.likesCount + 1 });
  };

  if (!post) {
    return <p className="p-6 text-secondary">Loading...</p>;
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>

      <div className="mb-6 text-sm text-secondary">
        By{" "}
        <Link
          href={`/author/${encodeURIComponent(post.authorName)}`}
          className="text-primary hover:underline"
        >
          {post.authorName}
        </Link>{" "}
        •{" "}
        <Link
          href={`/category/${encodeURIComponent(post.category)}`}
          className="hover:underline"
        >
          {post.category}
        </Link>
      </div>

      <p className="mb-6 text-xs text-secondary">
        {post.createdAt?.toDate().toDateString()} • {post.viewsCount} views
      </p>

      <button
        onClick={handleLike}
        disabled={liked}
        className={`mb-10 inline-flex items-center gap-2 rounded-full
          border border-theme px-4 py-1.5 text-sm
          ${liked ? "opacity-60" : "hover:bg-primary/10"}`}
      >
        ❤️ {post.likesCount}
      </button>

      <div className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-line">
        {post.content}
      </div>

      <div className="mt-14 border-t border-theme pt-8">
        <Comments postId={id} />
      </div>

      <div className="mt-12">
        <DeleteRequestForm
          postTitle={post.title}
          authorName={post.authorName}
        />
      </div>
    </article>
  );
}
