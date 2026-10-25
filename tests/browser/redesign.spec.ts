import { test, expect } from "@playwright/test";

test("wordmark opens through a native scroll scene and the collection shortcut stays usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const hero = page.locator(".cinema-hero");
  await expect(hero).toHaveAttribute("data-enhanced", "true");
  await expect(hero).toHaveAttribute("data-phase", "wordmark");
  await expect(hero.locator("circle")).toHaveAttribute("r", "0.00");
  await expect(
    page.getByRole("link", { name: "View selected work", exact: true }),
  ).toBeInViewport();
  await page.evaluate(() => {
    const hero = document.querySelector<HTMLElement>(".cinema-hero")!;
    const stage = hero.querySelector<HTMLElement>(".cinema-stage")!;
    window.scrollTo({
      top: hero.offsetTop + (hero.offsetHeight - stage.offsetHeight) * 0.85,
      behavior: "instant",
    });
  });
  await expect(hero).toHaveAttribute("data-phase", "scene");
  await expect(page.locator(".cinema-statement")).toHaveCSS("opacity", "1");
  expect(
    Number(await hero.locator("circle").getAttribute("r")),
  ).toBeGreaterThan(500);
  await expect(page.locator("html")).toHaveAttribute("data-hero-tone", "dark");
  await page
    .getByRole("link", { name: "View selected work", exact: true })
    .click();
  await expect(page.locator("#work-title")).toBeInViewport();
  await expect(page.locator("html")).toHaveAttribute("data-hero-tone", "light");
});

test("hero reel has usable pause and next controls and pauses offscreen or on hidden pages", async ({
  page,
}) => {
  await page.goto("/");
  const hero = page.locator(".cinema-hero");
  await page
    .getByRole("button", { name: "Pause image reel", exact: true })
    .click();
  await expect(hero).toHaveAttribute("data-playing", "false");
  await page
    .getByRole("button", { name: "Next hero image", exact: true })
    .click();
  await expect(page.locator(".reel-controls")).toContainText(
    "Visual study 02 / 03",
  );
  await expect(hero).toHaveAttribute("data-playing", "false");
  await page
    .getByRole("button", { name: "Play image reel", exact: true })
    .click();
  await expect(hero).toHaveAttribute("data-playing", "true");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      value: true,
      configurable: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(hero).toHaveAttribute("data-playing", "false");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      value: false,
      configurable: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(hero).toHaveAttribute("data-playing", "true");
  await page.locator("#work").scrollIntoViewIfNeeded();
  await expect(hero).toHaveAttribute("data-playing", "false");
});

test("reduced motion collapses the scroll scene and leaves the portfolio directly reachable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const hero = page.locator(".cinema-hero");
  await expect(hero).toHaveAttribute("data-static", "true");
  const size = await hero.boundingBox();
  expect(size?.height).toBeLessThanOrEqual(950);
  await expect(hero.locator("circle")).toHaveAttribute("r", "0.00");
  await expect(
    page.getByRole("button", { name: "Pause image reel", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator(".cinema-slide.is-current img")).toHaveCSS(
    "animation-name",
    "none",
  );
  await page
    .getByRole("link", { name: "View selected work", exact: true })
    .click();
  await expect(page.locator("#work-title")).toBeInViewport();
  await page.getByRole("button", { name: /^Interiors/ }).click();
  await expect(page.locator(".project-card")).toHaveCount(3);
  expect(
    await page
      .locator(".project-card")
      .evaluateAll(
        (nodes) => nodes.flatMap((node) => node.getAnimations()).length,
      ),
  ).toBe(0);
});

test("collection reflow animates and a desktop case study has media beside its information", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator("#work").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /^Architecture/ }).click();
  await expect(page.locator(".project-card")).toHaveCount(3);
  expect(
    await page
      .locator(".project-card")
      .evaluateAll((nodes) =>
        nodes.some((node) =>
          node.getAnimations().some((a) => a.playState === "running"),
        ),
      ),
  ).toBe(true);
  await page.locator(".project-card").first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const { media, intro } = await dialog.locator(".story-opening").evaluate((element) => {
    const media = element.querySelector(".story-hero")!.getBoundingClientRect();
    const intro = element.querySelector(".story-intro")!.getBoundingClientRect();
    return { media: { x: media.x, y: media.y, width: media.width }, intro: { x: intro.x, y: intro.y } };
  });
  expect(media!.x + media!.width).toBeLessThanOrEqual(intro!.x + 1);
  expect(Math.abs(media!.y - intro!.y)).toBeLessThan(5);
  await expect(dialog.locator(".story-facts")).toContainText(
    "Add confirmed role",
  );
  await expect(
    dialog.getByRole("button", { name: /^Enlarge image:/ }).first(),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  const { mobileMedia, mobileIntro } = await dialog.locator(".story-opening").evaluate((element) => {
    const media = element.querySelector(".story-hero")!.getBoundingClientRect();
    const intro = element.querySelector(".story-intro")!.getBoundingClientRect();
    return { mobileMedia: { y: media.y, height: media.height }, mobileIntro: { y: intro.y } };
  });
  expect(mobileMedia!.y + mobileMedia!.height).toBeLessThanOrEqual(
    mobileIntro!.y + 1,
  );
  await expect(
    dialog.getByRole("button", { name: "Close project", exact: true }),
  ).toBeInViewport();
});

test("without JavaScript the static wordmark, project links and safe demo form remain available", async ({
  browser,
}) => {
  const context = await browser.newContext({
    baseURL: "http://127.0.0.1:3100",
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
    "Studio Da'lo.",
  );
  await expect(
    page.getByRole("button", { name: "Preview enquiry", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("link", { name: "View selected work", exact: true })
    .click();
  await expect(page.locator("#work-title")).toBeInViewport();
  await page.locator(".project-card").first().click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
    "Courtyard — Placeholder 01",
  );
  await expect(page.locator(".project-credits")).toContainText(
    "Role & attribution",
  );
  await context.close();
});
