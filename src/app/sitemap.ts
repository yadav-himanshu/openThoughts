import type { MetadataRoute } from "next";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://open-thoughts-pi.vercel.app";

  // ✅ Only approved posts
  const q = query(collection(db, "posts"), where("approved", "==", true));

  const snapshot = await getDocs(q);

  const postUrls = snapshot.docs.map((doc) => ({
    url: `${baseUrl}/post/${doc.id}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...postUrls,
  ];
}
