import type { Project } from "./types";
export function approvedProjects(projects: Project[]) {
  return projects
    .filter((p) => p.approved)
    .toSorted((a, b) => a.featuredOrder - b.featuredOrder);
}
export function disciplines(projects: Project[]) {
  return [
    ...new Set([
      "Architecture",
      "Interiors",
      "Design",
      ...approvedProjects(projects).map((p) => p.discipline),
    ]),
  ];
}
export function filterProjects(
  projects: Project[],
  discipline = "All",
  query = "",
) {
  const needle = query.trim().toLocaleLowerCase();
  return approvedProjects(projects).filter(
    (p) =>
      (discipline === "All" || p.discipline === discipline) &&
      [p.title, p.sector, p.discipline, ...p.tags]
        .join(" ")
        .toLocaleLowerCase()
        .includes(needle),
  );
}
export function neighbors(projects: Project[], slug: string) {
  const list = approvedProjects(projects);
  const index = list.findIndex((p) => p.slug === slug);
  if (index === -1 || list.length < 2) return { previous: null, next: null };
  return {
    previous: list[(index - 1 + list.length) % list.length],
    next: list[(index + 1) % list.length],
  };
}
