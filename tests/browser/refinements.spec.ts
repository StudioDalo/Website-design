import { test, expect } from "@playwright/test";

test("desktop navigation is a centred compact pill and projects appear promptly", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const header = page.locator(".site-header");
  const bounds = await header.boundingBox();
  expect(bounds!.width).toBeGreaterThanOrEqual(720);
  expect(bounds!.width).toBeLessThanOrEqual(780);
  expect(bounds!.height).toBeLessThanOrEqual(64);
  expect(Math.abs(bounds!.x + bounds!.width / 2 - 720)).toBeLessThan(1);
  await expect(header).toHaveCSS("border-radius", "999px");
  await expect(page.locator(".cinema-identity")).toHaveCount(0);
  await page
    .getByRole("link", { name: "View selected work", exact: true })
    .click();
  await expect(page.locator(".project-card").first()).toBeInViewport();
  await expect
    .poll(
      async () =>
        (await page.locator(".project-card").first().boundingBox())!.y,
    )
    .toBeLessThan(540);
});

for (const width of [320, 390, 430]) {
  test(`phone ${width}px: shallow navigation and comfortable controls`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    const header = page.locator(".site-header");
    const bounds = await header.boundingBox();
    expect(bounds!.height).toBeLessThanOrEqual(64);
    expect(bounds!.width).toBeLessThanOrEqual(width - 24);
    await expect(
      header.getByRole("link", { name: "Contact", exact: true }),
    ).toBeVisible();
    for (const selector of [".mobile-contact", ".menu-button"]) {
      const control = await page.locator(selector).boundingBox();
      expect(control!.height).toBeGreaterThanOrEqual(44);
    }
    await page
      .getByRole("link", { name: "View selected work", exact: true })
      .click();
    await expect(page.locator(".project-card").first()).toBeInViewport();
    if (width >= 390) {
      await expect
        .poll(
          async () =>
            (await page.locator(".project-card").first().boundingBox())!.y,
        )
        .toBeLessThan(720);
    }
    if (width === 430) {
      const [a, b] = await page.locator(".project-card").evaluateAll((nodes) =>
        nodes.slice(0, 2).map((node) => {
          const r = node.getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width };
        }),
      );
      expect(b.x).toBeGreaterThan(a.x + a.width);
      expect(Math.abs(a.y - b.y)).toBeLessThan(1);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  });
}

test("navigation adapts to the contact and image sections, then returns to paper", async ({
  page,
}) => {
  await page.goto("/");
  const header = page.locator(".site-header");
  await expect(header).toHaveAttribute("data-tone", "light");
  for (const selector of ["#contact", ".material-interlude"]) {
    await page.locator(selector).evaluate((node) =>
      window.scrollTo({
        top: node.getBoundingClientRect().top + scrollY - 10,
        behavior: "instant",
      }),
    );
    await expect(header).toHaveAttribute("data-tone", "dark");
  }
  await page.locator("#about").evaluate((node) =>
    window.scrollTo({
      top: node.getBoundingClientRect().top + scrollY - 10,
      behavior: "instant",
    }),
  );
  await expect(header).toHaveAttribute("data-tone", "light");
});

test("reel cadence survives continuous scrolling and holds when the caption arrives", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".cinema-slide img")).toHaveCount(3);
  await expect
    .poll(() =>
      page
        .locator(".cinema-slide img")
        .evaluateAll((nodes) =>
          nodes.every(
            (node) =>
              (node as HTMLImageElement).complete &&
              (node as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  await page.clock.install();
  await page
    .getByRole("button", { name: "Pause image reel", exact: true })
    .click();
  await expect(page.locator(".cinema-hero")).toHaveAttribute(
    "data-playing",
    "false",
  );
  await page
    .getByRole("button", { name: "Play image reel", exact: true })
    .click();
  for (let i = 1; i <= 4; i++) {
    await page.evaluate(
      (top) => window.scrollTo({ top, behavior: "instant" }),
      i * 12,
    );
    await page.clock.runFor(1000);
  }
  await expect(page.locator(".reel-controls")).toContainText(
    "Visual study 02 / 03",
  );
  await page.evaluate(() => {
    const hero = document.querySelector<HTMLElement>(".cinema-hero")!;
    const stage = hero.querySelector<HTMLElement>(".cinema-stage")!;
    window.scrollTo({
      top: (hero.offsetHeight - stage.offsetHeight) * 0.85,
      behavior: "instant",
    });
  });
  await page.clock.runFor(100);
  await expect(page.locator(".cinema-hero")).toHaveAttribute(
    "data-reel-pace",
    "held",
  );
  const before = await page.locator(".reel-controls > span").textContent();
  await page.clock.runFor(6000);
  expect(await page.locator(".reel-controls > span").textContent()).toBe(
    before,
  );
});

test("project sheet is contained on desktop and closes with focus restored", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#work");
  const card = page.locator(".project-card").first();
  await card.click();
  const dialog = page.getByRole("dialog");
  const bounds = await dialog.boundingBox();
  expect(bounds!.width).toBeLessThanOrEqual(1160);
  expect(bounds!.height).toBeLessThanOrEqual(852);
  await page
    .getByRole("button", { name: "Close project", exact: true })
    .click();
  await expect(dialog).toHaveCount(0);
  await expect(card).toBeFocused();
});

test("the approved Instagram profile is linked from the footer and mobile menu", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const expected = "https://www.instagram.com/studiodalo_london/";
  const footer = page
    .locator("footer")
    .getByRole("link", { name: /@studiodalo_london/ });
  await expect(footer).toHaveAttribute("href", expected);
  await expect(footer).toHaveAttribute("rel", "noopener noreferrer");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("dialog").getByRole("link", { name: /@studiodalo_london/ }),
  ).toHaveAttribute("href", expected);
});
