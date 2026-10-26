import { test } from "node:test";
import { instagramProfile } from "../lib/social";
import assert from "node:assert/strict";
import {
  mediaFromCms,
  projectsFromCms,
  settingsFromCms,
  fetchCmsContent,
  contentQuery,
} from "../lib/cms";

const media = {
  src: "https://cdn.sanity.io/images/example/production/stone-1600x1000.webp",
  type: "image",
  width: 1600,
  height: 1000,
  alt: "Warm stone courtyard in afternoon light",
  caption: "Courtyard",
  credit: "Approved creator",
  focalX: 0.3,
  focalY: 0.6,
};
const project = {
  _id: "public-study",
  slug: "new-courtyard",
  title: "New courtyard",
  discipline: "Architecture",
  sector: "Residential",
  introduction: "A study in light and material.",
  hero: media,
  gallery: [media],
  approved: true,
  placeholder: false,
  featuredOrder: 1,
  tags: ["stone"],
};
test("CMS boundary excludes drafts, releases and unapproved records before parsing private fields", () => {
  const output = projectsFromCms([
    project,
    { _id: "drafts.secret", approved: true, secret: "DO_NOT_SERIALISE" },
    { _id: "versions.release.secret", approved: true },
    { _id: "hidden", approved: false },
  ]);
  assert.equal(output.length, 1);
  assert.equal(output[0].slug, "new-courtyard");
  assert.ok(!JSON.stringify(output).includes("DO_NOT_SERIALISE"));
  assert.equal(output[0].gallery.length, 1);
});
test("CMS changes can publish a new project, reorder and remove all projects", () => {
  const second = {
    ...project,
    _id: "second",
    slug: "second",
    featuredOrder: 0,
  };
  assert.equal(projectsFromCms([project, second])[0].slug, "second");
  assert.deepEqual(projectsFromCms([]), []);
  assert.throws(() => projectsFromCms([project, project]), /unique/);
  assert.throws(
    () => projectsFromCms([{ ...project, slug: "../draft" }]),
    /slug/,
  );
});
test("CMS media requires HTTPS approved CDN, dimensions, descriptions and video poster", () => {
  assert.equal(mediaFromCms(media).aspectRatio, 1.6);
  assert.equal(mediaFromCms(media).focalX, 0.3);
  for (const bad of [
    { src: "https://example.org/private" },
    { width: 0 },
    { alt: "" },
    { credit: "" },
    { src: "javascript:alert(1)" },
  ])
    assert.throws(() => mediaFromCms({ ...media, ...bad }));
  assert.throws(() => mediaFromCms({ ...media, type: "video" }));
  assert.equal(
    mediaFromCms({ ...media, type: "video", poster: media.src }).type,
    "video",
  );
});
test("settings restrict font choices and size presets while accepting edited homepage and contact text", () => {
  const settings = settingsFromCms({
    appearance: {
      bodyFont: "evil url()",
      headingFont: "georgia",
      textSize: "tiny",
    },
    home: { introTitle: "New introduction" },
    brand: { email: "owner@example.org" },
    hero: { images: [media] },
  });
  assert.equal(settings.appearance.bodyFont, "manrope");
  assert.equal(settings.appearance.headingFont, "georgia");
  assert.equal(settings.appearance.textSize, "comfortable");
  assert.equal(settings.home.introTitle, "New introduction");
  assert.equal(settings.brand.email, "owner@example.org");
  assert.equal(settings.hero.images.length, 1);
  assert.throws(() => settingsFromCms({ brand: { email: "invalid" } }));
  assert.throws(() =>
    settingsFromCms({ brand: { siteUrl: "javascript:alert(1)" } }),
  );
});
test("CMS is optional only when unconfigured; incomplete configuration and fetch failure stop the build", async () => {
  assert.equal(await fetchCmsContent({}), null);
  assert.equal(
    await fetchCmsContent({
      SANITY_PROJECT_ID: "example",
      SANITY_DATASET: "production",
      SANITY_CONTENT_ENABLED: "0",
    }),
    null,
  );
  await assert.rejects(
    fetchCmsContent({ SANITY_PROJECT_ID: "example" }),
    /both/,
  );
  const env = { SANITY_PROJECT_ID: "example", SANITY_DATASET: "production" };
  const fetcher: typeof fetch = async () =>
    new Response("unavailable", { status: 503 });
  await assert.rejects(fetchCmsContent(env, fetcher), /503/);
});
test("CMS uses published perspective and keeps the read token in the server request only", async () => {
  let requested = false;
  const fetcher: typeof fetch = async (input, init) => {
    requested = true;
    const url = new URL(String(input));
    assert.equal(url.searchParams.get("perspective"), "published");
    assert.equal(url.searchParams.get("query"), contentQuery);
    assert.ok(!url.href.includes("unit-test-secret"));
    assert.equal(
      new Headers(init?.headers).get("authorization"),
      "Bearer unit-test-secret",
    );
    return Response.json({ result: { projects: [project], settings: {} } });
  };
  const result = await fetchCmsContent(
    {
      SANITY_PROJECT_ID: "example",
      SANITY_DATASET: "production",
      SANITY_READ_TOKEN: "unit-test-secret",
    },
    fetcher,
  );
  assert.ok(requested);
  assert.equal(result?.projects.length, 1);
  assert.ok(!JSON.stringify(result).includes("unit-test-secret"));
});

test("Instagram links accept the owner's profile and reject executable or unrelated destinations", () => {
  assert.deepEqual(
    instagramProfile("https://www.instagram.com/studiodalo_london/#"),
    {
      url: "https://www.instagram.com/studiodalo_london/",
      handle: "@studiodalo_london",
    },
  );
  assert.equal(instagramProfile(""), null);
  for (const url of [
    "javascript:alert(1)",
    "https://example.org/studiodalo_london/",
    "https://www.instagram.com.evil.org/studiodalo_london/",
    "https://www.instagram.com/direct/inbox/",
  ]) {
    assert.throws(() => settingsFromCms({ brand: { instagram: url } }));
  }
});
