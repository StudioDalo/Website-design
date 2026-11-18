import { test, expect } from "@playwright/test";
async function openGallery(page: import("@playwright/test").Page) {
  await page.goto("/work/courtyard-study/");
  await page
    .locator(".story-hero")
    .getByRole("button", { name: /^Enlarge image:/ })
    .click();
  await expect(page.locator(".gallery-counter")).toHaveText("1 / 3");
}
test("gallery supports keyboard, arrows, thumbnails, originals and focus restoration", async ({
  page,
}) => {
  await openGallery(page);
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".gallery-counter")).toHaveText("2 / 3");
  await expect(page.locator(".gallery-stage img")).toHaveAttribute(
    "src",
    /drawing/,
  );
  await page.getByRole("button", { name: "Next image", exact: true }).click();
  await expect(page.locator(".gallery-counter")).toHaveText("3 / 3");
  await page.getByRole("button", { name: /^View image 1:/ }).click();
  await expect(page.locator(".gallery-counter")).toHaveText("1 / 3");
  await expect(page.locator(".gallery-stage img")).toHaveCSS(
    "object-fit",
    "contain",
  );
  await expect(
    page.getByRole("link", { name: "Open original at full size" }),
  ).toHaveAttribute("href", /courtyard-render.webp/);
  await page.keyboard.press("Escape");
  await expect(page.locator(".zoom-dialog")).toHaveCount(0);
  await expect(
    page
      .locator(".story-hero")
      .getByRole("button", { name: /^Enlarge image:/ }),
  ).toBeFocused();
});
test("gallery autoplay advances, pauses and respects reduced motion", async ({
  page,
}) => {
  await page.clock.install();
  await openGallery(page);
  await page
    .getByRole("button", { name: "Play slideshow", exact: true })
    .click();
  await page.clock.runFor(5100);
  await expect(page.locator(".gallery-counter")).toHaveText("2 / 3");
  await page
    .getByRole("button", { name: "Pause slideshow", exact: true })
    .click();
  await page.clock.runFor(6000);
  await expect(page.locator(".gallery-counter")).toHaveText("2 / 3");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    page.getByRole("button", { name: "Play slideshow", exact: true }),
  ).toBeDisabled();
});
test("phone swipe moves between full uncropped project images", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openGallery(page);
  const stage = page.locator(".gallery-stage");
  await stage.dispatchEvent("touchstart", {
    touches: [{ identifier: 1, clientX: 300, clientY: 250 }],
  });
  await stage.dispatchEvent("touchend", {
    changedTouches: [{ identifier: 1, clientX: 100, clientY: 255 }],
  });
  await expect(page.locator(".gallery-counter")).toHaveText("2 / 3");
  expect(
    await page
      .locator(".zoom-dialog")
      .evaluate((node) => node.scrollWidth <= node.clientWidth),
  ).toBe(true);
});
test("privacy, search exclusions and downloadable transparent logos are available", async ({
  page,
  request,
}) => {
  await page.goto("/brand/");
  for (const file of [
    "logo-light.svg",
    "logo-dark.png",
    "symbol-light.png",
    "symbol-dark.svg",
  ]) {
    const response = await request.get(`/brand/${file}`);
    expect(response.ok()).toBe(true);
  }
  await page.goto("/privacy/");
  await expect(
    page.getByRole("heading", { name: "Privacy & storage", exact: true }),
  ).toBeVisible();
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).not.toContain("courtyard-study");
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /admin/");
  if (process.env.STUDIO_DALO_TEST_STATIC === "1") {
    const home = await request.get("/");
    expect(home.headers()["content-security-policy"]).toContain("'sha256-");
    expect(home.headers()["content-security-policy"]).not.toContain(
      "script-src 'self' 'unsafe-inline'",
    );
    expect(home.headers()["x-frame-options"]).toBe("DENY");
  }
});

test("hidden tabs pause the slideshow and resume a fresh viewing interval", async ({
  page,
}) => {
  await page.clock.install();
  await openGallery(page);
  await page
    .getByRole("button", { name: "Play slideshow", exact: true })
    .click();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.clock.runFor(11000);
  await expect(page.locator(".gallery-counter")).toHaveText("1 / 3");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.clock.runFor(5100);
  await expect(page.locator(".gallery-counter")).toHaveText("2 / 3");
});
test("data-saving preference retains manual gallery navigation", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: { saveData: true },
    }),
  );
  await openGallery(page);
  await expect(
    page.getByRole("button", { name: "Play slideshow", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Next image", exact: true }).click();
  await expect(page.locator(".gallery-counter")).toHaveText("2 / 3");
});
test("missing gallery media leaves captions and next-image controls usable", async ({
  page,
}) => {
  await page.route("**/media/courtyard-render.webp", (route) => route.abort());
  await openGallery(page);
  await expect(page.locator(".gallery-stage .media-fallback")).toBeVisible();
  await page.getByRole("button", { name: "Next image", exact: true }).click();
  await expect(page.locator(".gallery-counter")).toHaveText("2 / 3");
  await expect(page.locator(".gallery-stage img")).toBeVisible();
});
