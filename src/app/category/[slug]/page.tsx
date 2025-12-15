import PostList from "@/components/PostList";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  return <PostList fixedCategory={decodeURIComponent(params.slug)} />;
}
