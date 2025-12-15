import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-14">
      {/* Title */}
      <header className="mb-14 text-center">
        <h1 className="text-3xl font-bold mb-4">About OpenThoughts</h1>
        <p className="mx-auto max-w-2xl text-lg text-secondary leading-relaxed">
          OpenThoughts is a calm, open space where anyone can share thoughts,
          feelings, stories, and creativity — without noise, without pressure.
        </p>
      </header>

      {/* Content */}
      <section className="space-y-12">
        {/* What */}
        <div>
          <h2 className="mb-3 text-xl font-semibold">
            🌱 What is OpenThoughts?
          </h2>
          <p className="text-secondary leading-relaxed">
            OpenThoughts is a community-driven platform for sharing Shayari,
            Poems, Short Stories, Quotes, and personal Thoughts in Hindi and
            English.
            <br />
            <br />
            There are no attention-hungry algorithms here — just words,
            emotions, and ideas that matter.
          </p>
        </div>

        {/* Why */}
        <div>
          <h2 className="mb-3 text-xl font-semibold">
            ✨ Why this platform exists
          </h2>
          <p className="text-secondary leading-relaxed">
            Many people carry beautiful thoughts but don’t have a space where
            they feel heard. Social media is often rushed and overwhelming.
            <br />
            <br />
            OpenThoughts exists to slow things down and let words breathe.
          </p>
        </div>

        {/* What you can do */}
        <div>
          <h2 className="mb-3 text-xl font-semibold">
            🖊️ What you can do here
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-secondary">
            <li>Share your writing without creating an account</li>
            <li>Read thoughtful content from real people</li>
            <li>Like and comment on posts</li>
            <li>Explore posts by author or category</li>
          </ul>
        </div>

        {/* Community */}
        <div>
          <h2 className="mb-3 text-xl font-semibold">
            🤝 Our community promise
          </h2>
          <p className="text-secondary leading-relaxed">
            We value originality, kindness, and honesty.
            <br />
            <br />
            Every post is reviewed to keep OpenThoughts meaningful, respectful,
            and spam-free.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-20 text-center">
        <p className="mb-5 text-lg font-medium">Have something to say?</p>
        <Link
          href="/submit"
          className="inline-flex items-center justify-center
                     rounded-md bg-primary px-6 py-3
                     text-sm font-medium text-white
                     transition hover:opacity-90"
        >
          Post Your Story
        </Link>
      </div>
    </main>
  );
}
