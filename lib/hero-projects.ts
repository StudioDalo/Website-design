// Keep the original opening sequence for sites without an explicit selection.
export function automaticHeroProjects<T>(orderedProjects: readonly T[]): T[] {
  return [0, 1, 5].flatMap((index) => orderedProjects.slice(index, index + 1));
}
