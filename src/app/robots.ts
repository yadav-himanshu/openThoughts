import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/login", "/admin/dashboard", "/admin/edit"],
      },
    ],
    sitemap: "https://open-thoughts-pi.vercel.app/sitemap.xml",
  };
}
