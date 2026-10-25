import { defineCliConfig } from "sanity/cli";
import project from "../sanity-project.json";
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || project.projectId,
    dataset: process.env.SANITY_STUDIO_DATASET || project.dataset,
  },
});
