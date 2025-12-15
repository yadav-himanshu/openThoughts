import type { Metadata } from "next";
import PostList from "@/components/PostList";

/* -----------------------------
   SEO Metadata
------------------------------ */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;

  let authorName = name;
  try {
    authorName = decodeURIComponent(name);
  } catch {}

  return {
    title: `Posts by ${authorName}`,
    description: `Read all thoughts, poems, shayari, and stories written by ${authorName} on OpenThoughts.`,
    alternates: {
      canonical: `/author/${encodeURIComponent(authorName)}`,
    },
  };
}

/* -----------------------------
   Page
------------------------------ */
export default async function AuthorPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  let author = name;
  try {
    author = decodeURIComponent(name);
  } catch {}

  return (
    <main>
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold">
          Posts by {author}
        </h1>
        <p className="mt-2 max-w-2xl text-secondary">
          Explore all writings shared by {author}.
        </p>
      </section>

      <PostList fixedAuthor={author} />
    </main>
  );
}
