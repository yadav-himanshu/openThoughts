import type { Metadata } from "next";
import PostList from "@/components/PostList";

/* -----------------------------
   SEO Metadata
------------------------------ */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let category = slug;
  try {
    category = decodeURIComponent(slug);
  } catch {}

  return {
    title: `${category} – OpenThoughts`,
    description: `Read ${category} including poems, shayari, short stories, quotes, and thoughts shared by the community on OpenThoughts.`,
    alternates: {
      canonical: `/category/${encodeURIComponent(category)}`,
    },
  };
}

/* -----------------------------
   Page
------------------------------ */
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let category = slug;
  try {
    category = decodeURIComponent(slug);
  } catch {}

  return (
    <main>
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold">
          {category}
        </h1>
        <p className="mt-2 max-w-2xl text-secondary">
          Explore {category} written by different authors on OpenThoughts.
        </p>
      </section>

      <PostList fixedCategory={category} />
    </main>
  );
}
