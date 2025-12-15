"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/send-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: "Contact Us Message",
        message: `
          <b>Name:</b> ${name}<br/>
          <b>Email:</b> ${email}<br/>
          <b>Message:</b><br/>${message}
        `,
      }),
    });

    setSuccess(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-14">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold">Contact Us</h1>
        <p className="mx-auto max-w-xl text-secondary leading-relaxed">
          Have feedback, suggestions, or something to share? We’d love to hear
          from you. Drop us a message and we’ll get back as soon as possible.
        </p>
      </header>

      {/* Content Grid */}
      <div className="grid gap-10 md:grid-cols-2">
        {/* Info */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-2 text-lg font-semibold">
              Why contact OpenThoughts?
            </h2>
            <p className="text-secondary leading-relaxed">
              Whether it’s feedback about the platform, a feature request, or a
              concern about content — your voice matters to us.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold">What can you share?</h2>
            <ul className="list-disc pl-6 space-y-2 text-secondary">
              <li>General feedback or suggestions</li>
              <li>Content-related concerns</li>
              <li>Collaboration ideas</li>
              <li>Any thoughts you’d like to share</li>
            </ul>
          </div>

          <div className="rounded-xl border border-theme bg-secondary p-4">
            <p className="text-sm text-secondary">
              📩 All messages are reviewed personally. We respect your privacy
              and never share your details.
            </p>
          </div>
        </section>

        {/* Form */}
        <section>
          <form
            onSubmit={submitForm}
            className="space-y-5 rounded-xl border border-theme
                       bg-secondary p-6"
          >
            {success && (
              <p
                className="rounded-md bg-primary/10 px-4 py-2
                            text-sm text-primary"
              >
                Message sent successfully. Thank you for reaching out!
              </p>
            )}

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

            <input
              type="email"
              placeholder="Your Email"
              className="w-full rounded-md border border-theme bg-transparent
                         px-3 py-2 text-sm text-primary
                         placeholder:text-secondary
                         focus:outline-none focus:ring-1 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <textarea
              placeholder="Your Message"
              className="h-36 w-full rounded-md border border-theme bg-transparent
                         px-3 py-2 text-sm text-primary
                         placeholder:text-secondary
                         focus:outline-none focus:ring-1 focus:ring-primary"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full rounded-md bg-primary
                         py-2.5 text-sm font-medium text-white
                         transition hover:opacity-90"
            >
              Send Message
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
