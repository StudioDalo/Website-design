import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const origin = "http://127.0.0.1:3112";
const server = spawn("python3", ["scripts/serve-static.py", "--port", "3112"]);
let browser;
try {
  await new Promise((resolve, reject) => {
    server.stdout.once("data", resolve);
    server.once("error", reject);
  });
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage();
  const errors = [],
    failures = [],
    requests = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.url().startsWith(origin) && response.status() >= 400)
      failures.push(response.url());
  });
  // Mock only the unauthenticated API boundary; no real account access is claimed.
  await page.route("https://**/*", async (route) => {
    const url = new URL(route.request().url());
    requests.push(url.hostname + url.pathname);
    if (url.pathname.endsWith("/users/me"))
      return route.fulfill({
        status: 401,
        json: { statusCode: 401, error: "Unauthorized", message: "No session" },
      });
    if (url.pathname.endsWith("/auth/providers"))
      return route.fulfill({
        json: {
          providers: [
            {
              name: "google",
              title: "Google",
              url: "https://api.sanity.io/v1/auth/login/google",
            },
            {
              name: "github",
              title: "GitHub",
              url: "https://api.sanity.io/v1/auth/login/github",
            },
          ],
        },
      });
    if (url.pathname.endsWith(".js"))
      return route.fulfill({ contentType: "application/javascript", body: "" });
    return route.fulfill({ json: {} });
  });
  await page.goto(origin + "/admin/");
  await page.getByRole("link", { name: /Google/i }).waitFor({ timeout: 15000 });
  assert.equal(new URL(page.url()).pathname, "/admin/");
  const login = new URL(
    await page.getByRole("link", { name: /Google/i }).getAttribute("href"),
  );
  assert.equal(login.searchParams.get("projectId"), "eurg3hlb");
  assert.equal(login.searchParams.get("origin"), origin + "/admin/");
  assert.deepEqual(failures, []);
  assert.deepEqual(errors, []);
  const report = {
    localEntryAndChunks: "pass",
    loginRouteAndReturnAddress: "pass",
    realAccountAuthentication: "not attempted; API mocked",
    errors,
    failures,
    mockedRequests: requests,
  };
  await writeFile(
    "artifacts/editor-browser-check.json",
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser?.close();
  server.kill();
}
