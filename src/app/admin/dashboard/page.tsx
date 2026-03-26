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
  getCountFromServer,
  where,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, FileText, Clock, MessageSquare, Shield, CheckCircle, Trash2, Edit3, Eye, AlertCircle } from "lucide-react";

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
  slug?: string;
  deleteRequested?: boolean;
};

/* -----------------------------
   Status Filter
------------------------------ */
type StatusFilter = "all" | "pending" | "approved" | "requests";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    pending: 0,
    comments: 0,
    deleteRequests: 0
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin) {
        router.push("/");
      } else {
        fetchAllPosts();
        fetchStats();
        setLoading(false);
      }
    }
  }, [user, isAdmin, authLoading, router]);

  /* -----------------------------
     Fetch all posts (UNCHANGED)
  ------------------------------ */
  const fetchAllPosts = async () => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const result: Post[] = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Post, "id">),
    }));

    setPosts(result);
  };

  const fetchStats = async () => {
    try {
      const usersCol = collection(db, "users");
      const postsCol = collection(db, "posts");
      const pendingQuery = query(collection(db, "posts"), where("approved", "==", false));
      const requestsQuery = query(collection(db, "posts"), where("deleteRequested", "==", true));
      const commentsCol = collection(db, "comments");

      const [uSnap, pSnap, pendSnap, reqSnap, cSnap] = await Promise.all([
        getCountFromServer(usersCol),
        getCountFromServer(postsCol),
        getCountFromServer(pendingQuery),
        getCountFromServer(requestsQuery),
        getCountFromServer(commentsCol)
      ]);

      setStats({
        users: uSnap.data().count,
        posts: pSnap.data().count,
        pending: pendSnap.data().count,
        deleteRequests: reqSnap.data().count,
        comments: cSnap.data().count
      });
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
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
    try {
      await deleteDoc(doc(db, "posts", id));
      fetchAllPosts();
    } catch (err: any) {
      console.error(err);
      alert("Failed to delete post. Please verify your Firestore security rules and Admin UID. Error: " + err.message);
    }
  };

  /* -----------------------------
     Filtered posts
  ------------------------------ */
  const filteredPosts = posts.filter((post) => {
    if (filter === "pending") return !post.approved;
    if (filter === "approved") return post.approved;
    if (filter === "requests") return (post as any).deleteRequested === true;
    return true;
  });

  /* -----------------------------
     UI
  ------------------------------ */
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest text-[10px]">
          <Shield size={12} />
          Central Command
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">Admin Dashboard.</h1>
        <p className="text-slate-600 dark:text-slate-400 font-medium italic font-serif">
          Moderation hub for the OpenThoughts collective.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        {[
          { label: "Total Minds", value: stats.users, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Total Stories", value: stats.posts, icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Awaiting Review", value: stats.pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Delete Requests", value: stats.deleteRequests, icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
          { label: "Conversations", value: stats.comments, icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none">
            <div className={`h-10 w-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Moderation Queue</h2>
          <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400">
            {filteredPosts.length} Items
          </span>
        </div>
        <div className="flex items-center gap-2">
          {["all", "pending", "approved", "requests"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as StatusFilter)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${filter === f
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg"
                : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-500/30"
                }`}
            >
              {f === "requests" ? "Requests" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Moderation List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="py-20 text-center rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-400 font-medium italic">All quiet in the sanctuary.</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="group p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm hover:shadow-md"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`h-2 w-2 rounded-full ${post.approved ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate tracking-tight">{post.title}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><Users size={12} className="text-indigo-500" /> {post.authorName}</span>
                    <span className="flex items-center gap-1.5 text-slate-300 dark:text-slate-700">|</span>
                    <span className="flex items-center gap-1.5">{post.category}</span>
                    <span className="flex items-center gap-1.5 text-slate-300 dark:text-slate-700">|</span>
                    <span>{post.language}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/post/${post.slug || post.id}`}
                    className="p-3 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-600 hover:border-indigo-600/30 transition-all"
                    title="Preview"
                  >
                    <Eye size={18} />
                  </Link>

                  {!post.approved && (
                    <button
                      onClick={() => approvePost(post.id)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-full text-sm font-bold transition-all hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
                    >
                      <CheckCircle size={18} />
                      Approve
                    </button>
                  )}

                  <Link
                    href={`/admin/edit/${post.id}`}
                    className="p-3 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-amber-600 hover:border-amber-600/30 transition-all"
                    title="Edit"
                  >
                    <Edit3 size={18} />
                  </Link>

                  <button
                    onClick={() => deletePost(post.id)}
                    className="p-3 rounded-full border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-500 hover:border-red-500/30 transition-all"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
