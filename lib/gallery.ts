import type { Media, Project } from "./types";

export function projectGallery(
  project: Pick<Project, "hero" | "gallery">,
): Media[] {
  const seen = new Set<string>();
  return [project.hero, ...project.gallery].filter((media) => {
    if (seen.has(media.src)) return false;
    seen.add(media.src);
    return true;
  });
}
