"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

/* -----------------------------
   Types
------------------------------ */
type Post = {
  title: string;
  category: string;
  content: string;
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const CATEGORIES = ["Shayari", "Poems", "Short Stories", "Quotes", "Thoughts"];

export default function AdminEditPost({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState<Post | null>(null);

  /* -----------------------------
     Auth + Fetch Post
  ------------------------------ */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/admin/login");
        return;
      }

      const ref = doc(db, "posts", id);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        alert("Post not found");
        router.push("/admin/dashboard");
        return;
      }

      const data = snap.data();

      setPost({
        title: data.title,
        category: data.category,
        content: data.content,
      });

      setLoading(false);
    });

    return () => unsub();
  }, [id, router]);

  /* -----------------------------
     Save Changes
  ------------------------------ */
  const saveChanges = async () => {
    if (!post) return;

    setSaving(true);

    await updateDoc(doc(db, "posts", id), {
      title: post.title.trim(),
      category: post.category,
      content: post.content.trim(),
    });

    setSaving(false);
    router.push("/admin/dashboard");
  };

  /* -----------------------------
     UI
  ------------------------------ */
  if (loading || !post) {
    return <p className="p-6">Loading post...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>

      <div className="space-y-4">
        {/* Title */}
        <input
          type="text"
          className="w-full border rounded p-2"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
        />

        {/* Category */}
        <select
          className="w-full border rounded p-2"
          value={post.category}
          onChange={(e) => setPost({ ...post, category: e.target.value })}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Content */}
        <textarea
          className="w-full border rounded p-2 h-48"
          value={post.content}
          onChange={(e) => setPost({ ...post, content: e.target.value })}
        />

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={saveChanges}
            disabled={saving}
            className="bg-indigo-600 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={() => router.back()}
            className="border px-6 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
