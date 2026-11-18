import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { publicUrl } from "@/lib/seo";
export const dynamic = "force-static";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects, settings } = await getContent();
  const real = projects.filter((project) => !project.placeholder);
  return real.length
    ? [
        { url: publicUrl(settings) },
        ...real.map((project) => ({
          url: publicUrl(settings, `/work/${project.slug}/`),
        })),
      ]
    : [];
}
