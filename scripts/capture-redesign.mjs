import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
const base = "http://127.0.0.1:3130";
const server = spawn("python3", ["scripts/serve-static.py", "--port", "3130"]);
let browser;
const observations = {
  pageErrors: [],
  consoleErrors: [],
  failedResponses: [],
  layouts: [],
};
try {
  await new Promise((resolve, reject) => {
    server.stdout.once("data", resolve);
    server.once("error", reject);
    server.once("exit", (code) =>
      reject(new Error(`Capture server exited ${code}`)),
    );
  });
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  page.on("pageerror", (e) => observations.pageErrors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") observations.consoleErrors.push(m.text());
  });
  page.on("response", (r) => {
    if (r.url().startsWith(base) && r.status() >= 400)
      observations.failedResponses.push({
        path: new URL(r.url()).pathname,
        status: r.status(),
      });
  });
  for (const [name, width, height] of [
    ["desktop", 1440, 900],
    ["mobile", 390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto(base, { waitUntil: "networkidle" });
    await page
      .getByRole("button", { name: "Pause image reel", exact: true })
      .click();
    await page.screenshot({ path: `artifacts/redesign-${name}-opening.png` });
    for (const [phase, progress] of [
      ["transition", 0.35],
      ["reveal", 0.85],
    ]) {
      await page.evaluate((p) => {
        const root = document.querySelector(".cinema-hero");
        const stage = root.querySelector(".cinema-stage");
        window.scrollTo({
          top: (root.offsetHeight - stage.offsetHeight) * p,
          behavior: "instant",
        });
      }, progress);
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `artifacts/redesign-${name}-${phase}.png`,
      });
    }
    await page.evaluate(() =>
      window.scrollTo({
        top: document.getElementById("work").offsetTop - 105,
        behavior: "instant",
      }),
    );
    await page.waitForTimeout(500);
    await page.screenshot({ path: `artifacts/redesign-${name}-work.png` });
    await page.locator(".project-card").first().click();
    await page.getByRole("dialog").waitFor();
    await page.waitForTimeout(550);
    await page.screenshot({ path: `artifacts/redesign-${name}-project.png` });
    await page.getByRole("button", { name: /^Enlarge drawing/ }).click();
    await page.locator(".zoom-dialog").waitFor();
    await page.waitForTimeout(550);
    await page.screenshot({ path: `artifacts/redesign-${name}-drawing.png` });
    await page
      .getByRole("button", { name: "Close enlarged media", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Close project", exact: true })
      .click();
    await page.getByRole("dialog").waitFor({ state: "detached" });
    await page.locator("#about").scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    await page.screenshot({ path: `artifacts/redesign-${name}-about.png` });
    await page.locator("#contact-title").scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    await page.screenshot({ path: `artifacts/redesign-${name}-contact.png` });
    observations.layouts.push({
      width,
      height,
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    });
  }
  await fs.writeFile(
    "artifacts/redesign-observations.json",
    JSON.stringify(observations, null, 2) + "\n",
  );
  console.log(JSON.stringify(observations, null, 2));
  if (
    observations.pageErrors.length ||
    observations.consoleErrors.length ||
    observations.failedResponses.length ||
    observations.layouts.some((v) => v.overflow)
  )
    process.exitCode = 1;
} finally {
  await browser?.close();
  server.kill("SIGTERM");
}
