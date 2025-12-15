"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { db, auth } from "@/lib/firebase";

/* -----------------------------
   Types
------------------------------ */
type Comment = {
  id: string;
  postId: string;
  name: string;
  comment: string;
  createdAt: Timestamp;
};

type CommentsProps = {
  postId: string;
};

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState<User | null>(null);

  /* -----------------------------
     Detect Admin (UNCHANGED)
  ------------------------------ */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAdmin(user);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  /* -----------------------------
     Fetch Comments (UNCHANGED)
  ------------------------------ */
  const fetchComments = async () => {
    const q = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      orderBy("createdAt", "desc"),
    );

    const snapshot = await getDocs(q);

    const data: Comment[] = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Comment, "id">),
    }));

    setComments(data);
  };

  /* -----------------------------
     Submit Comment (UNCHANGED)
  ------------------------------ */
  const submitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setLoading(true);

    await addDoc(collection(db, "comments"), {
      postId,
      name: name.trim(),
      comment: comment.trim(),
      createdAt: Timestamp.now(),
    });

    setName("");
    setComment("");
    setLoading(false);
    fetchComments();
  };

  /* -----------------------------
     Delete Comment (Admin Only)
  ------------------------------ */
  const deleteComment = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;

    await deleteDoc(doc(db, "comments", commentId));
    fetchComments();
  };

  /* -----------------------------
     UI (UPDATED)
  ------------------------------ */
  return (
    <section className="mt-12">
      {/* Header */}
      <h3 className="mb-6 text-lg font-semibold">
        Comments{" "}
        <span className="text-sm text-secondary">({comments.length})</span>
      </h3>

      {/* Comment Form */}
      <form
        onSubmit={submitComment}
        className="mb-10 space-y-4 rounded-xl border border-theme
                   bg-secondary p-5"
      >
        <input
          type="text"
          placeholder="Your name"
          className="w-full rounded-md border border-theme bg-transparent
                     px-3 py-2 text-sm text-primary
                     placeholder:text-secondary
                     focus:outline-none focus:ring-1 focus:ring-primary"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Write a comment..."
          className="h-28 w-full rounded-md border border-theme bg-transparent
                     px-3 py-2 text-sm text-primary
                     placeholder:text-secondary
                     focus:outline-none focus:ring-1 focus:ring-primary"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center rounded-md bg-primary
                     px-4 py-2 text-sm font-medium text-white
                     transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {/* Comment List */}
      <div className="space-y-5">
        {comments.map((c) => (
          <div
            key={c.id}
            className="flex gap-4 rounded-xl border border-theme
                       bg-secondary p-4"
          >
            {/* Avatar */}
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center
                            rounded-full bg-primary/10 text-sm font-semibold"
            >
              {c.name.charAt(0).toUpperCase()}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{c.name}</p>

                {admin && (
                  <button
                    onClick={() => deleteComment(c.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>

              <p className="mt-1 text-xs text-secondary">
                {c.createdAt?.toDate().toDateString()}
              </p>

              <p className="mt-2 text-sm text-secondary leading-relaxed">
                {c.comment}
              </p>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-sm text-secondary">
            No comments yet. Be the first one!
          </p>
        )}
      </div>
    </section>
  );
}
