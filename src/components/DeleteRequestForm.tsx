"use client";

import { useState } from "react";

interface Props {
  postTitle: string;
  authorName: string;
}

export default function DeleteRequestForm({ postTitle, authorName }: Props) {
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/send-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: "Delete Post Request",
        message: `
          <b>Requester Name:</b> ${name}<br/>
          <b>Post Title:</b> ${postTitle}<br/>
          <b>Author Name:</b> ${authorName}<br/>
          <b>Reason:</b><br/>${reason}
        `,
      }),
    });

    setLoading(false);
    setSuccess(true);
    setName("");
    setReason("");
  };

  return (
    <section className="mt-14 border-t border-theme pt-10">
      <div className="max-w-xl">
        <h3 className="mb-2 text-lg font-semibold">Request post removal</h3>

        <p className="mb-6 text-sm text-secondary leading-relaxed">
          If you believe this post should be removed (for personal, privacy, or
          content-related reasons), you can submit a request below. All requests
          are reviewed manually.
        </p>

        {success && (
          <p
            className="mb-5 rounded-md bg-primary/10 px-4 py-2
                        text-sm text-primary"
          >
            Your request has been sent successfully. We’ll review it shortly.
          </p>
        )}

        <form
          onSubmit={submitRequest}
          className="space-y-4 rounded-xl border border-theme
                     bg-secondary p-6"
        >
          <input
            type="text"
            placeholder="Your Name"
            className="w-full rounded-md border border-theme bg-transparent
                       px-3 py-2 text-sm text-primary
                       placeholder:text-secondary
                       focus:outline-none focus:ring-1 focus:ring-primary"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <textarea
            placeholder="Why do you want this post to be deleted?"
            className="h-28 w-full rounded-md border border-theme
                       bg-transparent px-3 py-2 text-sm text-primary
                       placeholder:text-secondary
                       focus:outline-none focus:ring-1 focus:ring-primary"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded-md
                       border border-theme px-5 py-2 text-sm
                       text-red-500 transition
                       hover:bg-red-500/10
                       disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Delete Request"}
          </button>
        </form>
      </div>
    </section>
  );
}
