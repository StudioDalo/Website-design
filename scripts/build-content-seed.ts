import { writeFile } from "node:fs/promises";
import { getProjects } from "../lib/projects";
import { defaultSettings } from "../lib/site-settings";
writeFile(
  ".next-static/cms-seed.json",
  JSON.stringify({ projects: getProjects(), settings: defaultSettings }),
).catch(() => {
  console.error("Could not prepare the approved demonstration collection.");
  process.exitCode = 1;
});
