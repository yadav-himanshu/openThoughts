"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { slugify } from "@/lib/slugify";

type PageProps = {
    params: Promise<{ id: string }>;
};

const CATEGORIES = ["Shayari", "Poems", "Short Stories", "Quotes", "Thoughts"];
const LANGUAGES = ["Hindi", "English"];

export default function EditPost({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { user, isAdmin, loading: authLoading } = useAuth();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [post, setPost] = useState<any>(null);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push("/login");
            return;
        }
        fetchPost();
    }, [user, authLoading, id, router]);

    const fetchPost = async () => {
        const ref = doc(db, "posts", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            alert("Post not found");
            router.push("/dashboard");
            return;
        }

        const data = snap.data();

        // Check permissions
        if (!isAdmin && data.authorId !== user?.uid) {
            alert("You do not have permission to edit this post.");
            router.push("/dashboard");
            return;
        }

        // Only allow edit if not approved OR if admin
        if (data.approved && !isAdmin) {
            alert("This post is already approved and cannot be edited.");
            router.push("/dashboard");
            return;
        }

        setPost({
            title: data.title || "",
            category: data.category || "Thoughts",
            language: data.language || "Hindi",
            content: data.content || "",
        });

        setLoading(false);
    };

    const saveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!post) return;

        setSaving(true);
        try {
            const baseSlug = slugify(post.title || "untitled");
            const slug = `${baseSlug}-${id.substring(0, 5).toLowerCase()}`;

            await updateDoc(doc(db, "posts", id), {
                title: post.title.trim(),
                slug,
                category: post.category,
                language: post.language,
                content: post.content.trim(),
            });
            alert("Changes saved!");
            router.push(isAdmin ? "/admin/dashboard" : "/dashboard");
        } catch (err: any) {
            console.error(err);
            alert("Failed to save changes: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading || !post) {
        return <p className="p-8 text-secondary text-center">Loading post...</p>;
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold mb-6 text-primary">Edit Post</h1>

            <form onSubmit={saveChanges} className="space-y-4">
                <input
                    type="text"
                    placeholder="Title (optional)"
                    className="w-full border rounded p-2 text-primary bg-transparent border-theme focus:outline-none focus:ring-1 focus:ring-primary"
                    value={post.title}
                    onChange={(e) => setPost({ ...post, title: e.target.value })}
                />

                <div className="flex gap-3">
                    <select
                        className="w-1/2 border rounded p-2 text-primary bg-secondary border-theme focus:outline-none focus:ring-1 focus:ring-primary"
                        value={post.category}
                        onChange={(e) => setPost({ ...post, category: e.target.value })}
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    <select
                        className="w-1/2 border rounded p-2 text-primary bg-secondary border-theme focus:outline-none focus:ring-1 focus:ring-primary"
                        value={post.language}
                        onChange={(e) => setPost({ ...post, language: e.target.value })}
                    >
                        {LANGUAGES.map((lang) => (
                            <option key={lang} value={lang}>
                                {lang}
                            </option>
                        ))}
                    </select>
                </div>

                <textarea
                    placeholder="Write your thoughts here... *"
                    className="w-full border rounded p-2 h-40 text-primary bg-transparent border-theme focus:outline-none focus:ring-1 focus:ring-primary"
                    value={post.content}
                    onChange={(e) => setPost({ ...post, content: e.target.value })}
                    required
                />

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-primary text-white px-6 py-2 rounded hover:opacity-90 disabled:opacity-50 transition"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        disabled={saving}
                        className="border border-theme text-primary px-6 py-2 rounded hover:bg-theme transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
