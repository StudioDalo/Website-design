// Server data-access boundary. Replace these functions with a CMS query later.
// Client components receive only the explicitly approved projection.
import { sourceProjects } from "./project-source";
import { approvedProjects } from "./catalog";
export function getProjects() {
  return approvedProjects(sourceProjects);
}
export function getProject(slug: string) {
  return getProjects().find((p) => p.slug === slug);
}
