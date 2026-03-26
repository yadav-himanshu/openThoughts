"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import Link from "next/link";
import { Trash, Edit2, ExternalLink } from "lucide-react";

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState("profile");

    // Profile
    const [profile, setProfile] = useState<any>(null);
    const [savingProfile, setSavingProfile] = useState(false);
    const [insta, setInsta] = useState("");
    const [snap, setSnap] = useState("");

    // Posts
    const [myPosts, setMyPosts] = useState<any[]>([]);
    const [savedPosts, setSavedPosts] = useState<any[]>([]);
    const [myComments, setMyComments] = useState<any[]>([]);

    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        if (!user) return;
        setDataLoading(true);

        try {
            // 1. Fetch Profile
            const userDocRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userDocRef);
            if (userSnap.exists()) {
                const data = userSnap.data();
                setProfile(data);
                setInsta(data.instagram || "");
                setSnap(data.snapchat || "");
            }

            // 2. Fetch My Posts
            const postsQ = query(collection(db, "posts"), where("authorId", "==", user.uid));
            const postsSnap = await getDocs(postsQ);
            setMyPosts(postsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

            // 3. Fetch My Comments
            const commentsQ = query(collection(db, "comments"), where("authorId", "==", user.uid));
            const commentsSnap = await getDocs(commentsQ);
            setMyComments(commentsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

            // 4. Fetch Saved Posts (Assuming profile.savedPosts is an array of post IDs)
            if (userSnap.exists() && userSnap.data().savedPosts?.length > 0) {
                // Due to firestore 'in' query limit of 10, in real app we'd chunk this or fetch individually
                // For simplicity, we fetch them individually
                const savedIds = userSnap.data().savedPosts.slice(0, 10);
                const savedPromises = savedIds.map((id: string) => getDoc(doc(db, "posts", id)));
                const savedDocs = await Promise.all(savedPromises);
                setSavedPosts(savedDocs.map(d => ({ id: d.id, ...d.data() })).filter(d => d.title)); // Ensure it still exists
            }

        } catch (err) {
            console.error(err);
        } finally {
            setDataLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSavingProfile(true);
        try {
            await updateDoc(doc(db, "users", user.uid), {
                instagram: insta,
                snapchat: snap
            });
            alert("Profile updated!");
        } catch (err) {
            console.error(err);
            alert("Failed to update profile.");
        }
        setSavingProfile(false);
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;
        try {
            await deleteDoc(doc(db, "comments", commentId));
            setMyComments(prev => prev.filter(c => c.id !== commentId));
        } catch (err) {
            console.error(err);
            alert("Failed to delete comment");
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (!confirm("Are you sure you want to delete this pending post?")) return;
        try {
            await deleteDoc(doc(db, "posts", postId));
            setMyPosts(prev => prev.filter(p => p.id !== postId));
        } catch (err: any) {
            console.error(err);
            alert("Failed to delete post. Check Firebase rules. " + err.message);
        }
    };

    const handleRequestDeletion = async (postId: string) => {
        if (!confirm("Are you sure you want to request deletion for this published post?")) return;
        try {
            await updateDoc(doc(db, "posts", postId), {
                deleteRequested: true
            });
            setMyPosts(prev => prev.map(p => p.id === postId ? { ...p, deleteRequested: true } : p));
            alert("Deletion request sent. Admin will review it.");
        } catch (err: any) {
            console.error(err);
            alert("Failed to request deletion. " + err.message);
        }
    };

    if (loading || dataLoading) {
        return <div className="min-h-[50vh] flex items-center justify-center text-secondary">Loading dashboard...</div>;
    }

    if (!user) return null;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-12 tracking-tighter italic">Dashboard.</h1>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Sidebar Nav */}
                <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
                    {["profile", "posts", "saved", "comments"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap px-6 lg:px-4 py-3 rounded-full lg:rounded-xl font-bold text-sm transition-all border ${activeTab === tab
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20"
                                : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-500/30"
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            {tab === "posts" && myPosts.length > 0 && ` (${myPosts.length})`}
                            {tab === "saved" && savedPosts.length > 0 && ` (${savedPosts.length})`}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-xl shadow-slate-200/40 dark:shadow-none">

                    {/* PROFILE TAB */}
                    {activeTab === "profile" && (
                        <div className="space-y-6 max-w-xl">
                            <h2 className="text-xl font-semibold text-primary mb-6 border-b border-theme pb-4">Personal Details</h2>
                            <div className="flex items-center gap-4 mb-8">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="Avatar" className="w-16 h-16 rounded-full" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-theme flex items-center justify-center text-primary text-2xl font-bold">
                                        {user.displayName?.charAt(0) || "U"}
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-lg text-primary">{user.displayName}</p>
                                    <p className="text-secondary text-sm">{user.email}</p>
                                </div>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1">Instagram Username</label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 border border-r-0 border-theme bg-theme text-secondary rounded-l-md text-sm">@</span>
                                        <input
                                            type="text"
                                            value={insta}
                                            onChange={(e) => setInsta(e.target.value)}
                                            className="flex-1 px-4 py-2 border border-theme rounded-r-md bg-transparent focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                                            placeholder="username"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1">Snapchat Username</label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 border border-r-0 border-theme bg-theme text-secondary rounded-l-md text-sm">@</span>
                                        <input
                                            type="text"
                                            value={snap}
                                            onChange={(e) => setSnap(e.target.value)}
                                            className="flex-1 px-4 py-2 border border-theme rounded-r-md bg-transparent focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                                            placeholder="username"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={savingProfile}
                                    className="bg-primary text-white px-6 py-2 rounded-md hover:opacity-90 transition disabled:opacity-50"
                                >
                                    {savingProfile ? "Saving..." : "Save Profile"}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* MY POSTS TAB */}
                    {activeTab === "posts" && (
                        <div>
                            <h2 className="text-xl font-semibold text-primary mb-6 border-b border-theme pb-4">My Posts</h2>
                            {myPosts.length === 0 ? (
                                <p className="text-secondary">You haven't submitted any posts yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {myPosts.map(post => (
                                        <div key={post.id} className="p-4 border border-theme rounded-xl flex items-center justify-between hover:bg-theme/50 transition">
                                            <div>
                                                <Link href={`/post/${post.slug || post.id}`} className="font-semibold text-primary hover:underline">{post.title}</Link>
                                                <p className="text-sm text-secondary mt-1">
                                                    {post.category} • {post.createdAt?.toDate().toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {!post.approved ? (
                                                    <>
                                                        <Link href={`/edit-post/${post.id}`} className="text-sm text-secondary hover:text-primary transition flex items-center gap-1">
                                                            <Edit2 size={16} /> Edit
                                                        </Link>
                                                        <button onClick={() => handleDeletePost(post.id)} className="text-sm text-red-500 hover:text-red-600 transition flex items-center gap-1">
                                                            <Trash size={16} /> Delete
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        {post.deleteRequested ? (
                                                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                                                                Deletion Pending
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleRequestDeletion(post.id)}
                                                                className="text-xs font-bold text-slate-400 hover:text-red-500 transition border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-full"
                                                            >
                                                                Request Deletion
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                                <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full ${post.approved ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'}`}>
                                                    {post.approved ? 'Published' : 'Pending'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* SAVED POSTS TAB */}
                    {activeTab === "saved" && (
                        <div>
                            <h2 className="text-xl font-semibold text-primary mb-6 border-b border-theme pb-4">Saved Posts</h2>
                            {savedPosts.length === 0 ? (
                                <p className="text-secondary">You haven't saved any posts yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {savedPosts.map(post => (
                                        <div key={post.id} className="p-4 border border-theme rounded-xl flex items-center justify-between hover:bg-theme/50 transition">
                                            <div>
                                                <Link href={`/post/${post.slug || post.id}`} className="font-semibold text-primary hover:underline">{post.title}</Link>
                                                <p className="text-sm text-secondary mt-1">
                                                    By {post.authorName} • {post.category}
                                                </p>
                                            </div>
                                            <Link href={`/post/${post.slug || post.id}`} className="p-2 text-secondary hover:text-primary transition">
                                                <ExternalLink size={18} />
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* MY COMMENTS TAB */}
                    {activeTab === "comments" && (
                        <div>
                            <h2 className="text-xl font-semibold text-primary mb-6 border-b border-theme pb-4">My Comments</h2>
                            {myComments.length === 0 ? (
                                <p className="text-secondary">You haven't made any comments yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {myComments.map(comment => (
                                        <div key={comment.id} className="p-4 border border-theme rounded-xl flex items-start justify-between hover:bg-theme/50 transition group">
                                            <div>
                                                <p className="text-primary text-sm line-clamp-2">{comment.text}</p>
                                                <p className="text-xs text-secondary mt-2 flex items-center gap-2">
                                                    <Link href={`/post/${comment.postId}`} className="hover:underline text-primary">View Post</Link>
                                                    <span>•</span>
                                                    {comment.createdAt?.toDate().toLocaleDateString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="p-2 text-secondary hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                                                title="Delete Comment"
                                            >
                                                <Trash size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
