import type { Metadata } from "next";
import PostList from "@/components/PostList";

/* -----------------------------
   Home Page SEO
------------------------------ */
export const metadata: Metadata = {
  title: "Home",
  description:
    "Read and share Shayari, Poems, Short Stories, Quotes, and personal Thoughts in Hindi and English on OpenThoughts.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <main>
      {/* SEO Heading (Visible but subtle) */}
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-3">
          Share and explore meaningful thoughts
        </h1>
        <p className="max-w-2xl text-secondary leading-relaxed">
          Discover Shayari, Poems, Short Stories, Quotes, and personal thoughts
          shared by real people — in Hindi and English.
        </p>
      </section>

      {/* Posts */}
      <PostList />
    </main>
  );
}
