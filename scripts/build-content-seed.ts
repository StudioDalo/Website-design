import { writeFile } from "node:fs/promises";
import { getProjects } from "../lib/projects";
import { defaultSettings } from "../lib/site-settings";
import { projectImportFields } from "../lib/project-import";
writeFile(
  ".next-static/cms-seed.json",
  JSON.stringify({
    projects: getProjects().map((project) => ({
      ...projectImportFields(project),
      id: project.id,
      slug: project.slug,
      hero: project.hero,
      gallery: project.gallery,
    })),
    settings: defaultSettings,
  }),
).catch(() => {
  console.error("Could not prepare the approved demonstration collection.");
  process.exitCode = 1;
});
