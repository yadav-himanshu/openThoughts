import type { Metadata } from "next";
import PostList from "@/components/PostList";

/* -----------------------------
   Home Page SEO
------------------------------ */
export const metadata: Metadata = {
  title: "Home",
  description:
    "A curated sanctuary for Shayari, Poems, Short Stories, and personal reflections. Share your inner world on the OpenThoughts collective.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-6 border border-indigo-500/20">
          The Collective
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-[0.95] italic">
          Where every <span className="text-indigo-600 dark:text-indigo-400">thought</span> finds its <span className="text-indigo-600 dark:text-indigo-400">sanctuary.</span>
        </h1>
        <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-normal italic font-serif">
          A sanctuary for authors, poets, and deep thinkers. Share your inner world, discover hidden gems, and let your voice be heard in Hindi or English.
        </p>
      </section>

      {/* Posts */}
      <PostList />
    </main>
  );
}
