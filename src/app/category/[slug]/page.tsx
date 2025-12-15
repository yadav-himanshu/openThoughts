import PostList from "@/components/PostList";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <PostList fixedCategory={slug} />;
}
