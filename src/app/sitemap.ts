import type { MetadataRoute } from "next";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://open-thoughts-pi.vercel.app";

  // ✅ Only approved posts
  const q = query(
    collection(db, "posts"),
    where("approved", "==", true)
  );

  const snapshot = await getDocs(q);

  const postUrls: MetadataRoute.Sitemap = [];
  const authors = new Set<string>();
  const categories = new Set<string>();

  snapshot.docs.forEach((doc) => {
    const data = doc.data();

    // Posts
    postUrls.push({
      url: `${baseUrl}/post/${doc.id}`,
      lastModified: new Date(),
    });

    // Collect authors & categories
    if (data.authorName) {
      authors.add(data.authorName);
    }
    if (data.category) {
      categories.add(data.category);
    }
  });

  // Author pages
  const authorUrls = Array.from(authors).map((author) => ({
    url: `${baseUrl}/author/${encodeURIComponent(author)}`,
    lastModified: new Date(),
  }));

  // Category pages
  const categoryUrls = Array.from(categories).map((category) => ({
    url: `${baseUrl}/category/${encodeURIComponent(category)}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...postUrls,
    ...authorUrls,
    ...categoryUrls,
  ];
}
