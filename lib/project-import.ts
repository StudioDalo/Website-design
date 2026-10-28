import type { Project } from "./types";

// Only editable scalar/list fields may cross into a Sanity project document.
// Identity, slug and media are converted separately by the authenticated importer.
const editableFields = [
  "title",
  "discipline",
  "sector",
  "year",
  "location",
  "status",
  "introduction",
  "overview",
  "challenge",
  "approach",
  "outcome",
  "role",
  "contribution",
  "practice",
  "collaborators",
  "featuredOrder",
  "approved",
  "placeholder",
  "tags",
] as const satisfies readonly (keyof Project)[];

export function projectImportFields(value: object): Record<string, unknown> {
  const source = value as Record<string, unknown>;
  return Object.fromEntries(
    editableFields
      .filter((key) => Object.prototype.hasOwnProperty.call(source, key))
      .map((key) => [key, source[key]]),
  );
}
