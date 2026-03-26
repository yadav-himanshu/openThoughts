import type { Metadata } from "next";
import PostDetailClient from "./PostDetailClient";

/* -----------------------------
   Dynamic SEO
------------------------------ */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    // We can't easily use Firebase Admin here without more setup, 
    // but the existing API route might already handle this or we update it.
    // Assuming /api/post-meta/[id] should handle slug too.
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/post-meta/${id}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      return { title: "Post not found | OpenThoughts" };
    }

    const data = await res.json();
    const description = data.content?.slice(0, 150).replace(/\n/g, " ") || "";

    return {
      title: data.title,
      description,
      alternates: {
        canonical: `/post/${data.slug || id}`,
      },
      openGraph: {
        title: data.title,
        description,
        type: "article",
        url: `/post/${data.slug || id}`,
      },
    };
  } catch {
    return { title: "OpenThoughts Post" };
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PostDetailClient id={id} />;
}
