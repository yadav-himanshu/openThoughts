"use client";

import { useState } from "react";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Send, Sparkles, PenTool, Type, Globe, Tag } from "lucide-react";
import Link from "next/link";
import { slugify } from "@/lib/slugify";

const CATEGORIES = ["Shayari", "Poems", "Short Stories", "Quotes", "Thoughts"];
const LANGUAGES = ["Hindi", "English"];

export default function SubmitPost() {
  const { user, isAdmin } = useAuth();
  const [authorName, setAuthorName] = useState(user?.displayName || "");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Thoughts");
  const [language, setLanguage] = useState("Hindi");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!authorName || !content) {
      setError("Name and content are required.");
      return;
    }

    try {
      setLoading(true);

      let finalAuthorName = authorName;
      if (isAdmin) finalAuthorName = "Admin";
      else if (user && !authorName) finalAuthorName = user.displayName || "User";

      const postsRef = collection(db, "posts");
      const newDocRef = doc(postsRef);
      const baseSlug = slugify(title || "untitled");
      // Use first 5 chars of pre-generated ID for uniqueness
      const slug = `${baseSlug}-${newDocRef.id.substring(0, 5).toLowerCase()}`;

      await setDoc(newDocRef, {
        authorName: finalAuthorName,
        authorId: user ? user.uid : "guest",
        title: title || "Untitled",
        slug,
        category,
        language,
        content,
        approved: false,
        createdAt: Timestamp.now(),
        likesCount: 0,
        viewsCount: 0,
      });

      setSuccess(true);
      setAuthorName("");
      setTitle("");
      setContent("");
      setCategory("Thoughts");
      setLanguage("Hindi");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8 group font-bold text-xs uppercase tracking-widest">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Stories
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600">
              <Sparkles size={24} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tighter">Capture a Thought</h1>
          </div>
          <p className="text-slate-700 dark:text-slate-400 text-lg">Your words have weight. Share them with the collective.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-indigo-500/5 transition-all">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                {error}
              </div>
            )}
            {success && (
              <div className="p-6 rounded-2xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-sm font-medium">
                <p className="text-lg font-bold mb-1">Transmission Successful!</p>
                <p>Your thought has been submitted to the collective and is awaiting review.</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {!user && !isAdmin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Pseudonym / Name</label>
                  <div className="relative group">
                    <PenTool size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="e.g. Anonymous Thinker"
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-full py-4 pl-12 pr-6 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Title</label>
                <div className="relative group">
                  <Type size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Give your thought a name..."
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-full py-4 pl-12 pr-6 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Category</label>
                <div className="relative group">
                  <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                  <select
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-full py-4 pl-12 pr-6 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium cursor-pointer"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-white dark:bg-slate-900">{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Language</label>
                <div className="relative group">
                  <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                  <select
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-full py-4 pl-12 pr-6 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium cursor-pointer"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang} className="bg-white dark:bg-slate-900">{lang}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Content</label>
              <textarea
                placeholder="Write your thoughts here... let them flow naturally."
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-[2rem] py-6 px-6 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-serif italic text-lg h-60 min-h-[15rem] leading-relaxed resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 shadow-2xl shadow-indigo-500/10 relative group overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? "Transmitting..." : (
                  <>
                    Release into Collective
                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
