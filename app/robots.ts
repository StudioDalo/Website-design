import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { publicUrl } from "@/lib/seo";
export const dynamic = "force-static";
export default async function robots(): Promise<MetadataRoute.Robots> {
  const { settings } = await getContent();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/cms-seed.json"],
    },
    sitemap: publicUrl(settings, "/sitemap.xml"),
  };
}
