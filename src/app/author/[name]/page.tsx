import PostList from "@/components/PostList";

export default function AuthorPage({ params }: { params: { name: string } }) {
  let author = params.name;

  try {
    author = decodeURIComponent(params.name);
  } catch {
    // fallback to raw value if decoding fails
  }

  return <PostList fixedAuthor={author} />;
}
