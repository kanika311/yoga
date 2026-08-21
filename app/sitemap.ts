import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://healinsutras.com";
  return [
    "",
    "/about",
    "/yoga/prenatal",
    "/yoga/fertility",
    "/yoga/postnatal",
    "/blog",
    "/contact",
    "/book-demo",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
