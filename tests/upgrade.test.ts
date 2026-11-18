import { enquiryEmailHref } from "../lib/contact";
import { test } from "node:test";
import assert from "node:assert/strict";
import { projectGallery } from "../lib/gallery";
import { getProjects } from "../lib/projects";
import { settingsFromCms } from "../lib/cms";
import { pageMetadata, jsonLd, studioStructuredData } from "../lib/seo";
import { defaultSettings } from "../lib/site-settings";
import { sizedImageUrl } from "../lib/media-url";
const media = {
  src: "https://cdn.sanity.io/images/example/production/logo.png",
  type: "image",
  width: 600,
  height: 200,
  alt: "Studio identity",
  credit: "Studio Da’lo",
  caption: "",
};
test("gallery keeps the first uploaded image, prepends the cover once and removes duplicates", () => {
  const project = getProjects()[0];
  const additional = { ...project.hero, src: "/new-first.webp" };
  assert.deepEqual(
    projectGallery({
      hero: project.hero,
      gallery: [additional, project.hero, ...project.gallery, additional],
    }).map((image) => image.src),
    [
      project.hero.src,
      additional.src,
      ...project.gallery.slice(1).map((image) => image.src),
    ],
  );
});
test("new settings preserve old documents, validate image sources and accept logo/label/SEO edits", () => {
  assert.deepEqual(settingsFromCms({}).logos, defaultSettings.logos);
  const settings = settingsFromCms({
    logos: { light: media },
    labels: { work: "Selected projects" },
    seo: { title: "Studio search title", image: media },
  });
  assert.equal(settings.logos.light?.src, media.src);
  assert.equal(settings.labels.work, "Selected projects");
  assert.equal(settings.labels.contact, "Contact");
  assert.equal(settings.seo.title, "Studio search title");
  assert.throws(() =>
    settingsFromCms({
      logos: { light: { ...media, src: "https://untrusted.test/logo.png" } },
    }),
  );
});
test("SEO indexes real projects only and escapes structured-data script terminators", () => {
  const demo = getProjects()[0];
  assert.deepEqual(pageMetadata(defaultSettings, demo).robots, {
    index: false,
    follow: true,
  });
  const real = {
    ...demo,
    placeholder: false,
    seo: {
      title: "Specific project title",
      description: "Specific introduction",
    },
  };
  const metadata = pageMetadata(defaultSettings, real);
  assert.deepEqual(metadata.robots, { index: true, follow: true });
  assert.deepEqual(metadata.title, { absolute: "Specific project title" });
  assert.equal(
    metadata.alternates?.canonical,
    `${defaultSettings.brand.siteUrl}/work/${demo.slug}/`,
  );
  assert.ok(
    !jsonLd({ text: "</script><script>alert(1)</script>" }).includes("<"),
  );
  assert.deepEqual(JSON.parse(jsonLd({ text: "<studio>" })), {
    text: "<studio>",
  });
  assert.equal(studioStructuredData(defaultSettings)["@type"], "Organization");
});
test("responsive image requests are limited to Sanity image assets and preserve original links", () => {
  assert.ok(sizedImageUrl(media.src, 480).includes("w=480"));
  assert.equal(
    sizedImageUrl("https://untrusted.test/a.png", 480),
    "https://untrusted.test/a.png",
  );
  assert.equal(sizedImageUrl("/media/local.svg", 480), "/media/local.svg");
});

test("email enquiries encode project context without injecting mail headers", () => {
  const href = enquiryEmailHref(
    "studio@example.org",
    "Courtyard & Light\nBcc: bad@example.org",
  );
  assert.equal(
    href,
    "mailto:studio@example.org?subject=Courtyard%20%26%20Light%0ABcc%3A%20bad%40example.org",
  );
  assert.ok(!href.includes("\n"));
});
