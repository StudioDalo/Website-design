import { test, expect, type Page } from "@playwright/test";

async function smallText(page: Page, selector = "body") {
  return page.locator(selector).evaluate((root) => {
    const result: string[] = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const parent = node.parentElement;
      if (
        !parent ||
        !node.textContent?.trim() ||
        parent.closest("script,style,svg,.sr-only,[hidden]")
      )
        continue;
      if (
        !parent.checkVisibility({
          checkOpacity: true,
          checkVisibilityCSS: true,
        })
      )
        continue;
      const size = parseFloat(getComputedStyle(parent).fontSize);
      if (size < 16)
        result.push(
          `${parent.className || parent.tagName}: ${size}px: ${node.textContent.trim().slice(0, 65)}`,
        );
    }
    return result;
  });
}
for (const width of [320, 390, 768, 1440]) {
  test(`all visible text meets 16px minimum at ${width}px, including index and project details`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator(".cinema-hero")).toHaveAttribute(
      "data-enhanced",
      "true",
    );
    expect(await smallText(page)).toEqual([]);
    const proseSizes = await page
      .locator(
        ".section-heading > p, .about-copy > p:not(.about-lead):not(.profile-note), .contact-heading > p",
      )
      .evaluateAll((nodes) =>
        nodes.map((node) => parseFloat(getComputedStyle(node).fontSize)),
      );
    expect(proseSizes.every((size) => size >= 18 && size <= 20)).toBeTruthy();
    await page.locator("#work").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Index view", exact: true }).click();
    expect(await smallText(page)).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.locator(".index-row").first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    expect(await smallText(page, ".project-dialog")).toEqual([]);
    const storySizes = await page
      .locator(".project-dialog .story-lead, .project-dialog .story-prose p")
      .evaluateAll((nodes) =>
        nodes.map((node) => parseFloat(getComputedStyle(node).fontSize)),
      );
    expect(storySizes.every((size) => size >= 18 && size <= 20)).toBeTruthy();
    expect(
      await page
        .locator(".project-dialog")
        .evaluate((node) => node.scrollWidth <= node.clientWidth),
    ).toBeTruthy();
  });
}
test("200% text enlargement preserves navigation, project access and readable controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/");
  await page.addStyleTag({ content: "html { font-size: 32px !important; }" });
  await page
    .getByRole("link", { name: "View selected work", exact: true })
    .click();
  await expect(page.locator("#work-title")).toBeInViewport();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.locator(".project-card").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close project", exact: true }),
  ).toBeInViewport();
  expect(
    await page
      .locator(".project-dialog")
      .evaluate((node) => node.scrollWidth <= node.clientWidth),
  ).toBeTruthy();
});
