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
  arrayUnion,
  arrayRemove,
  collection,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Bookmark, BookmarkCheck, Heart, Eye, User, Calendar, Tag, Send } from "lucide-react";

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
  slug?: string;
};

export default function PostDetailClient({ id }: { id: string }) {
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPost();
    if (user) {
      checkIfSaved();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const checkIfSaved = async () => {
    if (!user) return;
    try {
      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.savedPosts && data.savedPosts.includes(id)) {
          setSaved(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPost = async () => {
    try {
      // 1. Try fetching by Document ID
      let ref = doc(db, "posts", id);
      let snap = await getDoc(ref);

      // 2. If not found, try fetching by Slug field
      if (!snap.exists()) {
        const q = query(collection(db, "posts"), where("slug", "==", id), limit(1));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
          snap = querySnap.docs[0];
          ref = doc(db, "posts", snap.id);
        }
      }

      if (!snap.exists()) return;

      const data = snap.data() as Omit<Post, "id">;
      const postId = snap.id;
      setPost({ id: postId, ...data });

      await updateDoc(ref, {
        viewsCount: increment(1),
      });

      let likedPosts: string[] = [];
      try {
        likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
      } catch { }

      setLiked(likedPosts.includes(postId));
    } catch (err) {
      console.error("Error fetching post:", err);
    }
  };

  const handleLike = async () => {
    if (!post) return;

    const ref = doc(db, "posts", id);
    let likedPosts = [];
    try {
      likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
    } catch { }

    if (liked) {
      // Unlike
      await updateDoc(ref, {
        likesCount: increment(-1),
      });
      likedPosts = likedPosts.filter((pId: string) => pId !== id);
      setPost({ ...post, likesCount: Math.max(0, post.likesCount - 1) });
      setLiked(false);
    } else {
      // Like
      await updateDoc(ref, {
        likesCount: increment(1),
      });
      likedPosts.push(id);
      setPost({ ...post, likesCount: post.likesCount + 1 });
      setLiked(true);
    }

    localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
  };

  const handleSave = async () => {
    if (!user) return alert("Please log in to save posts.");
    setSaving(true);
    const userRef = doc(db, "users", user.uid);
    try {
      if (saved) {
        await updateDoc(userRef, {
          savedPosts: arrayRemove(id),
        });
        setSaved(false);
      } else {
        await updateDoc(userRef, {
          savedPosts: arrayUnion(id),
        });
        setSaved(true);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  if (!post) {
    return <p className="p-6 text-secondary">Loading...</p>;
  }

  return (
    <article className="max-w-4xl mx-auto px-6 py-12 md:py-20">
      {/* Post Header */}
      <div className="mb-12">
        <div className="flex flex-wrap items-center gap-3 mb-6 text-xs font-bold uppercase tracking-widest text-slate-400">
          <Link href={`/category/${encodeURIComponent(post.category)}`} className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-colors flex items-center gap-1.5">
            <Tag size={12} />
            {post.category}
          </Link>
          <span className="flex items-center gap-1.5">
            <Calendar size={12} />
            {post.createdAt?.toDate().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye size={12} />
            {post.viewsCount || 0} views
          </span>
        </div>

        <div className="flex justify-between items-start gap-6">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tighter leading-[1.1]">
            {post.title}
          </h1>
          {user && (
            <button
              onClick={handleSave}
              disabled={saving}
              className={`p-4 rounded-full border transition-all ${saved
                ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-indigo-500/30 hover:text-indigo-600"
                }`}
            >
              {saved ? <BookmarkCheck size={24} /> : <Bookmark size={24} />}
            </button>
          )}
        </div>

        <div className="mt-8 flex items-center gap-4 py-6 border-y border-slate-100 dark:border-white/5">
          <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
            <User size={24} className="text-slate-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thought Captured By</p>
            <Link
              href={`/author/${encodeURIComponent(post.authorName)}`}
              className="text-lg font-bold text-slate-900 dark:text-white hover:text-indigo-500 transition-colors"
            >
              {post.authorName}
            </Link>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <div className="text-xl md:text-2xl leading-relaxed text-slate-700 dark:text-slate-300 font-serif whitespace-pre-line italic border-l-4 border-indigo-500 pl-8 py-2">
          {post.content}
        </div>
      </div>

      {/* Interactions */}
      <div className="mt-16 flex items-center gap-4">
        <button
          onClick={handleLike}
          className={`group flex items-center gap-3 px-8 py-4 rounded-full border transition-all ${liked
            ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/30"
            : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-red-500/30 hover:text-red-500"
            }`}
        >
          <Heart size={20} className={liked ? "fill-current" : "group-hover:fill-current transition-all"} />
          <span className="font-bold">{post.likesCount || 0} Likes</span>
        </button>

        <button
          className="p-4 rounded-full border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-indigo-500/30 hover:text-indigo-600 transition-all"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: post.title,
                url: window.location.href
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
            }
          }}
        >
          <Send size={20} />
        </button>
      </div>

      {/* Comments Section */}
      <div className="mt-24 pt-16 border-t border-slate-100 dark:border-white/5">
        <Comments postId={id} />
      </div>

      <div className="mt-20">
        <DeleteRequestForm
          postTitle={post.title}
          authorName={post.authorName}
        />
      </div>
    </article>
  );
}
