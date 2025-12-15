import PostList from "@/components/PostList";

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  let author = name;

  try {
    author = decodeURIComponent(name);
  } catch {
    // fallback to raw value if decoding fails
  }

  return <PostList fixedAuthor={author} />;
}
