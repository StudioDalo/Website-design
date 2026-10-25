import { cache } from "react";
import { fetchCmsContent } from "./cms";
import { getProjects } from "./projects";
import { defaultSettings } from "./site-settings";

// Fetch only during server rendering/builds. Browser bundles never receive API tokens.
export const getContent = cache(async () => {
  const cms = await fetchCmsContent();
  return cms ?? { projects: getProjects(), settings: defaultSettings };
});
