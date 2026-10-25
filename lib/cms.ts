import type { Project, Media } from "./types";
import { defaultSettings, type SiteSettings } from "./site-settings";

type RecordValue = Record<string, unknown>;
// Unique for this build process: prevent a host's restored fetch cache from
// serving the previous publication when the CMS webhook starts a new build.
const buildTag = `studio-dalo.${Date.now().toString(36)}`;
const record = (value: unknown): RecordValue =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as RecordValue)
    : {};
const text = (value: unknown) => (typeof value === "string" ? value : "");
const requiredText = (value: unknown, field: string) => {
  const result = text(value).trim();
  if (!result) throw new Error(`Published CMS content is missing ${field}.`);
  return result;
};
export function mediaFromCms(value: unknown): Media {
  const m = record(value);
  const src = requiredText(m.src, "media source");
  // Only Sanity's asset CDN can supply CMS media. No arbitrary URL or HTML execution.
  const url = new URL(src);
  if (url.protocol !== "https:" || url.hostname !== "cdn.sanity.io")
    throw new Error("CMS media must use the Sanity HTTPS asset CDN.");
  const width = Number(m.width),
    height = Number(m.height);
  if (!(width > 0 && height > 0 && width <= 50000 && height <= 50000))
    throw new Error("CMS media needs valid dimensions.");
  const type =
    m.type === "video" ? "video" : m.type === "drawing" ? "drawing" : "image";
  const poster = text(m.poster);
  if (type === "video") {
    const p = new URL(poster);
    if (p.protocol !== "https:" || p.hostname !== "cdn.sanity.io")
      throw new Error("Hero videos need a Sanity poster image.");
  }
  return {
    src,
    type,
    width,
    height,
    aspectRatio: width / height,
    alt: requiredText(m.alt, "image description"),
    caption: text(m.caption),
    credit: requiredText(m.credit, "image credit"),
    ...(poster ? { poster } : {}),
    ...(Number.isFinite(m.focalX) && Number.isFinite(m.focalY)
      ? { focalX: Number(m.focalX), focalY: Number(m.focalY) }
      : {}),
  };
}
export function projectsFromCms(values: unknown): Project[] {
  if (!Array.isArray(values))
    throw new Error("CMS did not return a project collection.");
  const seen = new Set<string>();
  return values
    .filter((v) => {
      const p = record(v);
      return (
        p.approved === true &&
        !text(p._id).startsWith("drafts.") &&
        !text(p._id).startsWith("versions.")
      );
    })
    .map((value) => {
      const p = record(value);
      const slug = requiredText(p.slug, "project URL");
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || seen.has(slug))
        throw new Error("CMS project URLs must be unique lowercase slugs.");
      seen.add(slug);
      const hero = mediaFromCms(p.hero);
      if (hero.type === "video")
        throw new Error(
          "Project covers must be still images; use the gallery or homepage hero for film.",
        );
      const gallery = Array.isArray(p.gallery)
        ? p.gallery.map(mediaFromCms)
        : [];
      const project: Project = {
        id: requiredText(p._id, "project ID"),
        slug,
        title: requiredText(p.title, "title"),
        discipline: requiredText(p.discipline, "discipline"),
        sector: requiredText(p.sector, "sector"),
        introduction: requiredText(p.introduction, "introduction"),
        hero,
        gallery: [hero, ...gallery.filter((m) => m.src !== hero.src)],
        featuredOrder: Number.isFinite(p.featuredOrder)
          ? Number(p.featuredOrder)
          : 999,
        approved: true,
        placeholder: p.placeholder === true,
        tags: Array.isArray(p.tags)
          ? p.tags.filter((t): t is string => typeof t === "string")
          : [],
      };
      for (const key of [
        "location",
        "status",
        "overview",
        "challenge",
        "approach",
        "outcome",
        "role",
        "contribution",
        "practice",
      ] as const) {
        if (text(p[key])) project[key] = text(p[key]);
      }
      if (typeof p.year === "number" && Number.isInteger(p.year))
        project.year = p.year;
      if (Array.isArray(p.collaborators))
        project.collaborators = p.collaborators.filter(
          (s): s is string => typeof s === "string",
        );
      return project;
    })
    .toSorted((a, b) => a.featuredOrder - b.featuredOrder);
}
function mergeText<T extends object>(base: T, input: unknown): T {
  const result = { ...base };
  const source = record(input);
  for (const key of Object.keys(base) as (keyof T)[]) {
    if (
      typeof base[key] === "string" &&
      typeof source[key as string] === "string"
    )
      result[key] = source[key as string] as T[keyof T];
  }
  return result;
}
export function settingsFromCms(value: unknown): SiteSettings {
  const s = record(value);
  const result: SiteSettings = {
    ...defaultSettings,
    brand: mergeText(defaultSettings.brand, s.brand),
    profile: mergeText(defaultSettings.profile, s.profile),
    home: mergeText(defaultSettings.home, s.home),
    appearance: { ...defaultSettings.appearance },
    hero: { ...defaultSettings.hero },
  };
  if (
    result.brand.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.brand.email)
  )
    throw new Error("The published contact email is invalid.");
  if (result.brand.siteUrl) {
    const origin = new URL(result.brand.siteUrl);
    if (origin.protocol !== "https:")
      throw new Error("The website origin must use HTTPS.");
    result.brand.siteUrl = origin.origin;
  }
  for (const key of ["approach", "capabilities"] as const) {
    const values = s[key];
    if (Array.isArray(values)) {
      const mapped = values.map((v, i) => ({
        number: String(i + 1).padStart(2, "0"),
        title: requiredText(record(v).title, key),
        body: requiredText(record(v).body, key),
      }));
      result[key] = mapped;
    }
  }
  const appearance = record(s.appearance);
  if (["manrope", "system", "georgia"].includes(text(appearance.bodyFont)))
    result.appearance.bodyFont = text(appearance.bodyFont);
  if (
    ["instrument", "georgia", "manrope"].includes(text(appearance.headingFont))
  )
    result.appearance.headingFont = text(appearance.headingFont);
  if (appearance.textSize === "larger") result.appearance.textSize = "larger";
  const hero = record(s.hero);
  if (Array.isArray(hero.images))
    result.hero.images = hero.images
      .map(mediaFromCms)
      .filter((m) => m.type !== "video")
      .slice(0, 6);
  if (hero.mode === "video" && hero.video) {
    result.hero.video = mediaFromCms(hero.video);
    if (result.hero.video.type !== "video")
      throw new Error("Video mode needs a video asset.");
    result.hero.mode = "video";
  }
  const home = record(s.home);
  if (home.aboutImage) result.home.aboutImage = mediaFromCms(home.aboutImage);
  if (home.interludeImage)
    result.home.interludeImage = mediaFromCms(home.interludeImage);
  return result;
}

// Explicit projection: no raw drafts, credentials or unrelated document fields reach the site.
const mediaProjection = `type,alt,caption,credit,"src":select(type == "video" => video.asset->url, image.asset->url),"width":select(type == "video" => width,image.asset->metadata.dimensions.width),"height":select(type == "video" => height,image.asset->metadata.dimensions.height),"poster":poster.asset->url,"focalX":image.hotspot.x,"focalY":image.hotspot.y`;
export const contentQuery = `{
"projects":*[_type == "project" && approved == true && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]{_id,title,"slug":slug.current,discipline,sector,year,location,status,introduction,overview,challenge,approach,outcome,role,contribution,practice,collaborators,featuredOrder,approved,placeholder,tags,hero{${mediaProjection}},gallery[]{${mediaProjection}}},
"settings":*[_type == "siteSettings" && _id == "siteSettings"][0]{brand,profile,approach,capabilities,appearance,hero{mode,images[]{${mediaProjection}},video{${mediaProjection}}},home{heroEyebrow,heroIntro,heroIntroEmphasis,heroStatement,heroStatementEmphasis,heroDescription,introEyebrow,introTitle,introEmphasis,collectionTitle,collectionEmphasis,collectionDescription,aboutTitle,aboutEmphasis,approachTitle,approachEmphasis,approachDescription,contactTitle,contactEmphasis,contactDescription,interludeTitle,interludeEmphasis,aboutImage{${mediaProjection}},interludeImage{${mediaProjection}}}}
}`;
export async function fetchCmsContent(
  env: Record<string, string | undefined> = process.env,
  fetcher: typeof fetch = fetch,
) {
  // Bootstrap the dashboard without replacing the current collection with an empty dataset.
  if (env.SANITY_CONTENT_ENABLED === "0") return null;
  const projectId = env.SANITY_PROJECT_ID,
    dataset = env.SANITY_DATASET;
  if (!projectId && !dataset) return null;
  if (
    !projectId ||
    !dataset ||
    !/^[a-z0-9]+$/.test(projectId) ||
    !/^[a-zA-Z0-9_-]+$/.test(dataset)
  )
    throw new Error("Configure both SANITY_PROJECT_ID and SANITY_DATASET.");
  const url = new URL(
    `https://${projectId}.api.sanity.io/v2025-02-19/data/query/${dataset}`,
  );
  url.searchParams.set("query", contentQuery);
  url.searchParams.set("perspective", "published");
  url.searchParams.set("tag", buildTag);
  // Next's default fetch policy reads once when prerendering each fresh build.
  // Explicit no-store would opt this route out of static export.
  const response = await fetcher(url, {
    signal: AbortSignal.timeout(20000),
    headers: env.SANITY_READ_TOKEN
      ? { Authorization: `Bearer ${env.SANITY_READ_TOKEN}` }
      : {},
  });
  if (!response.ok)
    throw new Error(
      `CMS read failed (${response.status}). The existing deployment should be retained.`,
    );
  const json: unknown = await response.json();
  const result = record(record(json).result);
  return {
    projects: projectsFromCms(result.projects),
    settings: settingsFromCms(result.settings),
  };
}
