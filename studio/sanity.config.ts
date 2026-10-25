import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { mediaItem, project, siteSettings } from "./schema";
import { Welcome } from "./welcome";
import { ProjectPreview } from "./preview";
import projectConfig from "../sanity-project.json";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || projectConfig.projectId;
const dataset = process.env.SANITY_STUDIO_DATASET || projectConfig.dataset;
if (!projectId || !dataset)
  throw new Error(
    "Set the Sanity project ID and dataset before building the editing dashboard.",
  );
export default defineConfig({
  name: "studio-dalo",
  title: "Studio Da'lo",
  projectId,
  dataset,
  basePath: "/admin",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Your website")
          .items([
            S.listItem()
              .title("Website settings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings"),
              ),
            S.listItem()
              .title("Projects")
              .child(
                S.documentTypeList("project")
                  .title("Projects")
                  .defaultOrdering([
                    { field: "featuredOrder", direction: "asc" },
                  ]),
              ),
          ]),
      defaultDocumentNode: (S, { schemaType }) =>
        schemaType === "project"
          ? S.document().views([
              S.view.form(),
              S.view.component(ProjectPreview).title("Content preview"),
            ])
          : S.document().views([S.view.form()]),
    }),
  ],
  tools: [
    { name: "getting-started", title: "Getting started", component: Welcome },
  ],
  schema: {
    types: [mediaItem, project, siteSettings],
    templates: (templates) =>
      templates.filter((t) => t.schemaType !== "siteSettings"),
  },
  document: {
    actions: (actions, { schemaType }) =>
      schemaType === "siteSettings"
        ? actions.filter(
            (a) =>
              !["delete", "duplicate", "unpublish"].includes(a.action || ""),
          )
        : actions,
  },
});
