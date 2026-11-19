import { test, expect, type Page } from "@playwright/test";
import path from "node:path";
async function mediaRoutes(page: Page) {
  await page.route("https://cdn.sanity.io/**", (route) =>
    route.fulfill({
      path: path.resolve(
        route.request().url().endsWith(".mp4")
          ? ".cms-test-export/test-clip.mp4"
          : "public/media/courtyard-render.webp",
      ),
    }),
  );
}
test("published CMS project, homepage text and typography reach the rendered site; drafts stay absent", async ({
  page,
}) => {
  await mediaRoutes(page);
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute(
    "data-body-font",
    "georgia",
  );
  await expect(page.locator("html")).toHaveAttribute(
    "data-heading-font",
    "manrope",
  );
  await expect(page.locator("html")).toHaveAttribute(
    "data-text-size",
    "larger",
  );
  await expect(
    page.getByText("Content controlled from the dashboard"),
  ).toBeVisible();
  await expect(page.locator(".project-card")).toHaveCount(2);
  await expect(page.locator("body")).not.toContainText(
    "PRIVATE_DRAFT_TEST_MARKER",
  );
  await page.goto("/work/cms-courtyard/");
  await expect(
    page.getByRole("heading", { name: "CMS courtyard", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".story-lead")).toContainText(
    "added through the CMS boundary",
  );
  await expect(page.locator(".project-story")).not.toContainText(
    "Add confirmed",
  );
  await expect(page.locator(".story-gallery video")).toHaveAttribute(
    "controls",
    "",
  );
  await expect(page.locator("button video")).toHaveCount(0);
  await page.goto("/work/private/");
  await expect(
    page.getByRole("heading", { name: /off the plan/i }),
  ).toBeVisible();
});
test("hero video plays muted, pauses manually and offscreen, then resumes on return", async ({
  page,
}) => {
  await mediaRoutes(page);
  await page.goto("/");
  const clip = page.locator(".cinema-slide video");
  await expect(clip).toHaveJSProperty("muted", true);
  await expect
    .poll(() =>
      clip.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > 0),
    )
    .toBe(true);
  await page.getByRole("button", { name: "Pause hero video" }).click();
  await expect(clip).toHaveJSProperty("paused", true);
  await page.getByRole("button", { name: "Play hero video" }).click();
  await expect
    .poll(() => clip.evaluate((v: HTMLVideoElement) => !v.paused))
    .toBe(true);
  await page.locator("#work").scrollIntoViewIfNeeded();
  await expect(clip).toHaveJSProperty("paused", true);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect
    .poll(() => clip.evaluate((v: HTMLVideoElement) => !v.paused))
    .toBe(true);
});
test("reduced motion shows the video poster without downloading a film", async ({
  page,
}) => {
  let filmRequests = 0;
  page.on("request", (request) => {
    if (request.url().endsWith("test.mp4")) filmRequests++;
  });
  await mediaRoutes(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".cinema-hero")).toHaveAttribute(
    "data-static",
    "true",
  );
  await expect(page.locator(".cinema-slide.is-current img")).toBeVisible();
  await expect(page.locator(".cinema-slide video")).toHaveCount(0);
  expect(filmRequests).toBe(0);
});

test("CMS SEO, logos and real email route are connected without overriding project titles", async ({
  page,
}) => {
  await mediaRoutes(page);
  await page.goto("/");
  await expect(page).toHaveTitle("Studio homepage search title");
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
    "href",
    /cdn.sanity.io/,
  );
  await page.setViewportSize({ width: 320, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator(".site-header .custom-brand-mark")).toBeVisible();
  await expect(page.locator(".footer-bottom")).toContainText(
    "Edited studio footer",
  );
  await expect(
    page.getByRole("link", { name: "Email the studio", exact: true }),
  ).toHaveAttribute("href", /^mailto:studio@example.org/);
  await page.goto("/work/cms-courtyard/");
  await expect(page).toHaveTitle("CMS courtyard — Studio Da'lo");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "index, follow",
  );
  const sitemap = await page.request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain("cms-courtyard");
});
test("single-image gallery disables navigation; video gallery retains native controls", async ({
  page,
}) => {
  await mediaRoutes(page);
  await page.goto("/work/single-image/");
  const defaultCover = page.getByRole("button", { name: /^Enlarge image:/ });
  await expect(defaultCover).toHaveText("Explore image");
  await defaultCover.click();
  await expect(page.locator(".gallery-counter")).toHaveText("1 / 1");
  await expect(
    page.getByRole("button", { name: "Next image", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Play slideshow", exact: true }),
  ).toHaveCount(0);
  await page.keyboard.press("Escape");
  await page.goto("/work/cms-courtyard/");
  const customCover = page.getByRole("button", {
    name: "Explore the courtyard: CMS test courtyard",
  });
  await expect(customCover).toHaveText("Explore the courtyard");
  await expect(page.locator(".story-hero figcaption")).toHaveText("Local test image");
  await customCover.click();
  await page.getByRole("button", { name: "Next image", exact: true }).click();
  await expect(page.locator(".gallery-stage video")).toHaveAttribute(
    "controls",
    "",
  );
  await expect(
    page.getByRole("button", { name: "Play slideshow", exact: true }),
  ).toBeDisabled();
});
