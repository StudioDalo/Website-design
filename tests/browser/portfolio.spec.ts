import { test, expect, type Page } from "@playwright/test";
async function work(page: Page) {
  await page.goto("/");
  await page.locator("#work").scrollIntoViewIfNeeded();
}
async function openFirst(page: Page) {
  await page.locator(".project-card").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

test("collection filters, counts, search, reset, empty state and view parity", async ({
  page,
}) => {
  await work(page);
  await expect(page.locator(".project-card")).toHaveCount(8);
  await page.getByRole("button", { name: /^Architecture/ }).click();
  await expect(page.locator(".project-card")).toHaveCount(3);
  await expect(page.locator(".result-count")).toContainText("03 projects");
  const wallTitles = await page.locator(".card-caption h3").allTextContents();
  await page.getByRole("button", { name: "Index view", exact: true }).click();
  await expect(page.locator(".index-row")).toHaveCount(3);
  expect(await page.locator(".index-project strong").allTextContents()).toEqual(
    wallTitles,
  );
  await page
    .getByRole("searchbox", { name: "Search projects" })
    .fill("COURTYARD");
  await expect(page.locator(".index-row")).toHaveCount(1);
  await page
    .getByRole("searchbox", { name: "Search projects" })
    .fill("nothing-matches");
  await expect(
    page.getByRole("heading", { name: "No projects found." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset the collection" }).click();
  await expect(page.locator(".index-row")).toHaveCount(8);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Index view", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("invalid persisted preference is safe and blocked storage is usable", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("dalo-view", "not json"));
  await work(page);
  await expect(page.locator(".project-card")).toHaveCount(8);
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error("Storage disabled");
    };
  });
  await page.getByRole("button", { name: "Index view", exact: true }).click();
  await expect(page.locator(".index-row")).toHaveCount(8);
});

test("overlay, filtered neighbors, focus, drawing, Escape, history and project enquiry", async ({
  page,
}) => {
  await work(page);
  await page.getByRole("button", { name: /^Design/ }).click();
  const firstCard = page.locator(".project-card").first();
  await firstCard.focus();
  await firstCard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toHaveCount(1);
  await expect(page.locator(".site-header")).toHaveAttribute("inert", "");
  await expect(page.locator("#work")).toHaveAttribute("inert", "");
  await expect(page).toHaveURL(/work\/material-dialogue/);
  await expect(dialog.getByRole("heading", { level: 1 })).toHaveAccessibleName(
    "Material dialogue — Placeholder 04",
  );
  // Native modal focus must never escape to background content.
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() => !!document.activeElement?.closest("dialog")),
    ).toBeTruthy();
  }
  await dialog.getByRole("button", { name: /^Enlarge drawing/ }).click();
  await expect(page.getByRole("dialog")).toHaveCount(2);
  await expect(
    page.getByRole("heading", { name: "Drawing — uncropped view" }),
  ).toBeVisible();
  await expect(page.locator(".zoom-dialog img")).toHaveCSS(
    "object-fit",
    "contain",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(1);
  await dialog.getByRole("link", { name: /Next project/ }).click();
  await expect(dialog.getByRole("heading", { level: 1 })).toHaveAccessibleName(
    "Studies in form — Placeholder 08",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(firstCard).toBeFocused();
  await page.goForward();
  await expect(page.getByRole("dialog")).toHaveCount(1);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Studies in form — Placeholder 08",
    }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Discuss a similar project" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator(".project-reference")).toContainText(
    "Studies in form — Placeholder 08",
  );
  await expect(page.locator("#contact-title")).toBeInViewport();
});

test("direct project, refresh, metadata, previous/next, unpublished and unknown 404", async ({
  page,
}) => {
  await page.goto("/work/quiet-room");
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
    "Quiet room — Placeholder 02",
  );
  await expect(page).toHaveTitle("Quiet room — Placeholder 02 — Studio Da'lo");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.reload();
  await expect(page.getByText("Role & attribution")).toBeVisible();
  await page.getByRole("link", { name: /Next project/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
    "Colonnade — Placeholder 03",
  );
  await page.getByRole("link", { name: "Discuss a similar project" }).click();
  await expect(page.locator(".project-reference")).toContainText(
    "Colonnade — Placeholder 03",
  );
  for (const slug of ["unknown-project", "unpublished-internal-study"]) {
    const response = await page.goto(`/work/${slug}`);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "off the plan",
    );
  }
  const home = await page.request.get("/");
  expect(await home.text()).not.toContain("Unpublished internal study");
  expect(await home.text()).not.toContain("/private/unapproved");
});

test("contact validation, honest demo outcome, no outbound enquiry and no personal storage", async ({
  page,
}) => {
  await page.goto("/?project=courtyard-study#contact");
  await expect(page.locator(".project-reference")).toContainText(
    "Courtyard — Placeholder 01",
  );
  await page.getByRole("button", { name: "Preview enquiry" }).click();
  await expect(page.getByText("Please enter your name.")).toBeVisible();
  await expect(page.getByLabel("Your name")).toBeFocused();
  await page.getByLabel("Your name").fill("QA Visitor");
  await page.getByLabel("Email address").fill("not-an-email");
  await page.getByLabel("Project type").selectOption("Architecture");
  await page
    .getByLabel("What are you thinking?")
    .fill("A thoughtful new project enquiry.");
  await page.getByRole("button", { name: "Preview enquiry" }).click();
  await expect(
    page.getByText("Please enter a valid email address."),
  ).toBeVisible();
  await page.getByLabel("Email address").fill("qa@example.org");
  const requests: string[] = [];
  page.on("request", (r) => {
    if (r.method() !== "GET") requests.push(r.url());
  });
  await page.getByRole("button", { name: "Preview enquiry" }).click();
  await expect(
    page.getByRole("button", { name: "Checking enquiry…" }),
  ).toBeDisabled();
  await expect(
    page.getByText("Demo only—your enquiry has not been sent."),
  ).toBeVisible();
  expect(requests).toEqual([]);
  const storage = await page.evaluate(() =>
    JSON.stringify({ ...localStorage }),
  );
  expect(storage).not.toContain("qa@example.org");
  expect(storage).not.toContain("QA Visitor");
  await page.getByRole("button", { name: "Remove project reference" }).click();
  await expect(page.locator(".project-reference")).toHaveCount(0);
});

test("copy link works and failure is reported honestly", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/work/courtyard-study");
  await page.evaluate(() =>
    Object.defineProperty(navigator, "share", {
      value: undefined,
      configurable: true,
    }),
  );
  await page.getByRole("button", { name: "Share project" }).click();
  await expect(page.getByText("Project link copied.")).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "/work/courtyard-study",
  );
  await page.evaluate(() =>
    Object.defineProperty(navigator.clipboard, "writeText", {
      value: () => Promise.reject(new Error("Permission denied")),
      configurable: true,
    }),
  );
  await page.getByRole("button", { name: "Share project" }).click();
  await expect(
    page.getByText(
      "Could not share. Copy the project URL from your address bar.",
    ),
  ).toBeVisible();
});

test("native share cancellation has honest feedback", async ({ page }) => {
  await page.goto("/work/courtyard-study");
  await page.evaluate(() =>
    Object.defineProperty(navigator, "share", {
      value: () => Promise.reject(new DOMException("Cancelled", "AbortError")),
      configurable: true,
    }),
  );
  await page.getByRole("button", { name: "Share project" }).click();
  await expect(page.getByText("Sharing cancelled.")).toBeVisible();
});

test("motion previews stop when offscreen, off, hidden or reduced motion", async ({
  page,
}) => {
  await work(page);
  const preview = page.locator(".project-card .media").first();
  await expect(preview).not.toHaveClass(/is-moving/);
  await page.getByRole("checkbox", { name: /Motion previews/ }).check();
  await preview.scrollIntoViewIfNeeded();
  await expect(preview).toHaveClass(/is-moving/);
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(preview).not.toHaveClass(/is-moving/);
  await preview.scrollIntoViewIfNeeded();
  await expect(preview).toHaveClass(/is-moving/);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      value: true,
      configurable: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(preview).not.toHaveClass(/is-moving/);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      value: false,
      configurable: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(preview).toHaveClass(/is-moving/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(preview).not.toHaveClass(/is-moving/);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("checkbox", { name: /Motion previews/ }).uncheck();
  await expect(preview).not.toHaveClass(/is-moving/);
});

test("missing images retain readable fallback", async ({ page }) => {
  await page.route(
    process.env.STUDIO_DALO_TEST_STATIC === "1"
      ? "**/media/courtyard*"
      : "**/_next/image**",
    async (route) => {
      if (route.request().url().includes("courtyard")) await route.abort();
      else await route.continue();
    },
  );
  await work(page);
  await expect(page.getByText("Image unavailable").first()).toBeVisible();
  await expect(
    page.getByRole("img", { name: /Media unavailable/ }).first(),
  ).toBeVisible();
});

for (const [width, height] of [
  [320, 800],
  [390, 844],
  [768, 1024],
  [1024, 768],
  [1440, 900],
]) {
  test(`responsive ${width}×${height}: no overflow, navigation, project and close controls`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: "Studio Da'lo." }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "View selected work", exact: true }),
    ).toBeInViewport();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    if (width < 768) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      await page
        .getByRole("navigation", { name: "Mobile navigation" })
        .getByRole("link", { name: /Work/ })
        .click();
      await expect(page.getByRole("dialog")).toHaveCount(0);
    } else
      await page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "Work", exact: true })
        .click();
    await expect(page.locator("#work-title")).toBeInViewport();
    await openFirst(page);
    await expect(
      page.getByRole("button", { name: "Close project", exact: true }),
    ).toBeInViewport();
    expect(
      await page
        .getByRole("dialog")
        .evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBeTruthy();
    await page.getByRole("link", { name: /Next project/ }).click();
    await expect(
      page.getByRole("dialog").getByRole("heading", { level: 1 }),
    ).toHaveAccessibleName("Quiet room — Placeholder 02");
    await expect(
      page.getByRole("button", { name: "Close project", exact: true }),
    ).toBeInViewport();
    await page
      .getByRole("button", { name: "Close project", exact: true })
      .click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}

test("data saving overrides motion and reacts to preference changes", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const connection = Object.assign(new EventTarget(), { saveData: true });
    Object.defineProperty(navigator, "connection", {
      value: connection,
      configurable: true,
    });
  });
  await work(page);
  await page.getByRole("checkbox", { name: /Motion previews/ }).check();
  const preview = page.locator(".project-card .media").first();
  await preview.scrollIntoViewIfNeeded();
  await expect(preview).not.toHaveClass(/is-moving/);
  await page.evaluate(() => {
    const connection = (
      navigator as Navigator & {
        connection: EventTarget & { saveData: boolean };
      }
    ).connection;
    connection.saveData = false;
    connection.dispatchEvent(new Event("change"));
  });
  await expect(preview).toHaveClass(/is-moving/);
});

test("long titles wrap in cards, index and stories at phone width", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await work(page);
  const title =
    "A deliberately very long project title for a residential courtyard and shared interior spaces — Placeholder 01";
  await page
    .locator(".card-caption h3")
    .first()
    .evaluate((el, value) => {
      el.textContent = value;
    }, title);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.getByRole("button", { name: "Index view", exact: true }).click();
  await page
    .locator(".index-project strong")
    .first()
    .evaluate((el, value) => {
      el.textContent = value;
    }, title);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.locator(".index-row").first().click();
  await page.locator("#project-title").evaluate((el, value) => {
    el.textContent = value;
  }, title);
  expect(
    await page
      .getByRole("dialog")
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBeTruthy();
  await expect(
    page.getByRole("button", { name: "Close project", exact: true }),
  ).toBeInViewport();
});

test("native share success passes the canonical project path", async ({
  page,
}) => {
  await page.goto("/work/colonnade");
  await page.evaluate(() =>
    Object.defineProperty(navigator, "share", {
      value: async (data: ShareData) => {
        (window as Window & { sharedUrl?: string }).sharedUrl = data.url;
      },
      configurable: true,
    }),
  );
  await page.getByRole("button", { name: "Share project" }).click();
  await expect(page.getByText("Shared.", { exact: true })).toBeVisible();
  expect(
    await page.evaluate(
      () => (window as Window & { sharedUrl?: string }).sharedUrl,
    ),
  ).toBe(`${new URL(page.url()).origin}/work/colonnade`);
});
