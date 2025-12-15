import type { MetadataRoute } from "next";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ✅ REQUIRED for Firebase */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://open-thoughts-pi.vercel.app";

  try {
    const q = query(
      collection(db, "posts"),
      where("approved", "==", true)
    );

    const snapshot = await getDocs(q);

    const urls: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
      },
    ];

    const authors = new Set<string>();
    const categories = new Set<string>();

    snapshot.docs.forEach((doc) => {
      const data = doc.data();

      urls.push({
        url: `${baseUrl}/post/${doc.id}`,
        lastModified: new Date(),
      });

      if (data.authorName) authors.add(data.authorName);
      if (data.category) categories.add(data.category);
    });

    authors.forEach((author) => {
      urls.push({
        url: `${baseUrl}/author/${encodeURIComponent(author)}`,
        lastModified: new Date(),
      });
    });

    categories.forEach((category) => {
      urls.push({
        url: `${baseUrl}/category/${encodeURIComponent(category)}`,
        lastModified: new Date(),
      });
    });

    return urls;
  } catch (error) {
    console.error("Sitemap generation failed", error);

    // ❗ Return at least homepage so Google doesn't fail
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
      },
    ];
  }
}
