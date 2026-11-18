import type { Metadata } from "next";
import type { SiteSettings } from "./site-settings";
import type { Project } from "./types";
export function publicUrl(settings: SiteSettings, path = "/") {
  return new URL(path, settings.brand.siteUrl).href;
}
export function pageMetadata(
  settings: SiteSettings,
  project?: Project,
  ready = true,
): Metadata {
  const seo = project ? project.seo || {} : settings.seo;
  const title =
    seo.title ||
    (project ? `${project.title} — ${settings.brand.name}` : "") ||
    `${settings.brand.name} — Architecture, Interiors & Design`;
  const description =
    seo.description || project?.introduction || settings.brand.description;
  const url = publicUrl(settings, project ? `/work/${project.slug}/` : "/");
  const image =
    seo.image || (!project?.placeholder ? project?.hero : undefined);
  const shareImage = image
    ? {
        url: image.src.startsWith("/")
          ? publicUrl(settings, image.src)
          : image.src,
        width: image.width,
        height: image.height,
        alt: image.alt,
      }
    : undefined;
  return {
    title: { absolute: title },
    description,
    metadataBase: new URL(settings.brand.siteUrl),
    alternates: { canonical: url },
    robots: { index: project ? !project.placeholder : ready, follow: true },
    openGraph: {
      title,
      description,
      url,
      type: project ? "article" : "website",
      siteName: settings.brand.name,
      ...(shareImage ? { images: [shareImage] } : {}),
    },
    twitter: {
      card: shareImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(shareImage ? { images: [shareImage.url] } : {}),
    },
    icons: { icon: settings.logos.icon?.src || "/icon.svg" },
  };
}
export function studioStructuredData(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": publicUrl(settings, "/#studio"),
    name: settings.brand.name,
    url: settings.brand.siteUrl,
    description: settings.brand.description,
    ...(settings.brand.email ? { email: settings.brand.email } : {}),
    ...(settings.brand.instagram ? { sameAs: [settings.brand.instagram] } : {}),
    ...(settings.logos.dark ? { logo: settings.logos.dark.src } : {}),
  };
}
export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
