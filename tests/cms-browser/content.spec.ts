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
  await expect(page.locator(".project-card")).toHaveCount(1);
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
