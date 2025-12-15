"use client";

import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const CATEGORIES = ["Shayari", "Poems", "Short Stories", "Quotes", "Thoughts"];

const LANGUAGES = ["Hindi", "English"];

export default function SubmitPost() {
  const [authorName, setAuthorName] = useState("");
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

      await addDoc(collection(db, "posts"), {
        authorName,
        title: title || "Untitled",
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
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Post Your Story</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && (
          <p className="text-green-600 text-sm">
            Thank you for sharing! Your post will be reviewed.
          </p>
        )}

        <input
          type="text"
          placeholder="Your Name *"
          className="w-full border rounded p-2"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Title (optional)"
          className="w-full border rounded p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="flex gap-3">
          <select
            className="w-1/2 border rounded p-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="w-1/2 border rounded p-2"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
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
          className="w-full border rounded p-2 h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
