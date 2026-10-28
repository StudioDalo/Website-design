import type { Media, Project } from "./types";
import { brand } from "./settings";
const credit =
  "Original SVG illustration created for this demonstration. No built project is depicted.";
const demoCaption = `Demonstration imagery — replace with ${brand.name} work`;
const generated: Record<
  string,
  { width: number; height: number; alt: string }
> = {
  colonnade: {
    width: 1448,
    height: 1086,
    alt: "AI-generated mood image of a limestone colonnade opening to a quiet landscape",
  },
  workplace: {
    width: 1122,
    height: 1402,
    alt: "AI-generated mood image of a communal walnut table in a light-filled workplace",
  },
  stairs: {
    width: 1448,
    height: 1086,
    alt: "AI-generated mood image of a sculptural stone stair with geometric daylight",
  },
  forms: {
    width: 1254,
    height: 1254,
    alt: "AI-generated architectural model study in plaster, olive clay, stone and timber",
  },
  courtyard: {
    width: 1672,
    height: 940,
    alt: "AI-generated mood image of a limestone courtyard, an olive tree and a reflecting pool",
  },
  interior: {
    width: 1122,
    height: 1402,
    alt: "AI-generated mood image of a quiet plaster interior overlooking an olive grove",
  },
  pavilion: {
    width: 1536,
    height: 1024,
    alt: "AI-generated mood image of a low glazed pavilion in a Mediterranean garden",
  },
  objects: {
    width: 1254,
    height: 1254,
    alt: "AI-generated material still life with travertine, olive ceramic, walnut and bronze",
  },
};
function media(name: string, alt: string, width = 1440, height = 1080): Media {
  const render = generated[name];
  if (render)
    return {
      src: `/media/${name}-render.webp`,
      type: "image",
      width: render.width,
      height: render.height,
      aspectRatio: render.width / render.height,
      alt: render.alt,
      caption: `${demoCaption} · AI-generated concept`,
      credit: `Original AI-generated architectural mood image created for this demonstration. Fictional design; not a ${brand.name} commission or Darlington’s work.`,
    };
  return {
    src: `/media/${name === "drawing" ? "drawing.svg" : name + ".webp"}`,
    type: "image",
    width,
    height,
    aspectRatio: width / height,
    alt,
    caption: demoCaption,
    credit,
  };
}
const slots = [
  {
    slug: "courtyard-study",
    title: "Courtyard — Placeholder 01",
    discipline: "Architecture",
    sector: "Residential",
    art: "courtyard",
    alt: "Illustrated stone courtyard, a tree and a shaded colonnade",
    tags: ["courtyard", "light", "stone"],
  },
  {
    slug: "quiet-room",
    title: "Quiet room — Placeholder 02",
    discipline: "Interiors",
    sector: "Hospitality",
    art: "interior",
    alt: "Illustrated room with a deep window, a sculptural chair and soft daylight",
    tags: ["retreat", "material", "light"],
  },
  {
    slug: "colonnade",
    title: "Colonnade — Placeholder 03",
    discipline: "Architecture",
    sector: "Concept",
    art: "colonnade",
    alt: "Illustrated sequence of concrete columns framing a landscape",
    tags: ["structure", "threshold", "concrete"],
  },
  {
    slug: "material-dialogue",
    title: "Material dialogue — Placeholder 04",
    discipline: "Design",
    sector: "Concept",
    art: "objects",
    alt: "Illustrated sculptural objects in clay, stone and dark timber",
    tags: ["objects", "material", "composition"],
  },
  {
    slug: "shared-table",
    title: "Shared table — Placeholder 05",
    discipline: "Interiors",
    sector: "Workplace",
    art: "workplace",
    alt: "Illustrated communal table and benches beneath tall windows",
    tags: ["gathering", "timber", "work"],
  },
  {
    slug: "garden-pavilion",
    title: "Garden pavilion — Placeholder 06",
    discipline: "Architecture",
    sector: "Hospitality",
    art: "pavilion",
    alt: "Illustrated low pavilion nestled in a green garden",
    tags: ["garden", "landscape", "threshold"],
  },
  {
    slug: "light-and-volume",
    title: "Light & volume — Placeholder 07",
    discipline: "Interiors",
    sector: "Residential",
    art: "stairs",
    alt: "Illustrated staircase with geometric light and shadow",
    tags: ["stair", "light", "volume"],
  },
  {
    slug: "studies-in-form",
    title: "Studies in form — Placeholder 08",
    discipline: "Design",
    sector: "Concept",
    art: "forms",
    alt: "Illustrated architectural forms arranged on a pale plinth",
    tags: ["model", "form", "composition"],
  },
];
export const sourceProjects: Project[] = slots.map(({ art, alt, ...slot }, i) => ({
  ...slot,
  id: `demo-${i + 1}`,
  featuredOrder: i + 1,
  approved: true,
  placeholder: true,
  introduction:
    "A demonstration slot for a future project story. The demonstration image explores a visual theme; it is not Darlington’s work or a completed commission.",
  overview:
    "Replace this text with a concise, approved account of the project: its context, brief and the ideas that shaped it.",
  challenge:
    "Add the actual design question, site conditions or constraints. Be specific about what the project needed to resolve.",
  approach:
    "Describe the confirmed design process, key decisions and material thinking. Add sketches and process images where publication is approved.",
  outcome:
    "Add an accurate account of the design or construction outcome when known. No project results are claimed in this demonstration.",
  hero: media(
    art,
    alt,
    1440,
    i === 1 || i === 4 ? 1800 : i === 3 || i === 7 ? 1440 : 1080,
  ),
  gallery: [
    media(
      art,
      alt,
      1440,
      i === 1 || i === 4 ? 1800 : i === 3 || i === 7 ? 1440 : 1080,
    ),
    {
      ...media(
        "drawing",
        "Demonstration plan drawing with courtyard, rooms and a scale bar",
        1600,
        1000,
      ),
      type: "drawing",
      caption:
        "Illustrative plan only — replace with an approved project drawing",
    },
    media(
      "detail",
      "Original illustrated material study of stone, timber and olive-green tile",
      1440,
      1080,
    ),
  ],
}));
// This fixture deliberately stays out of every public query and generated route.
sourceProjects.push({
  ...sourceProjects[0],
  id: "unapproved",
  slug: "unpublished-internal-study",
  title: "Unpublished internal study",
  approved: false,
  placeholder: false,
  hero: { ...sourceProjects[0].hero, src: "/private/unapproved.svg" },
  gallery: [],
});
