import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/cms-browser",
  workers: 1,
  timeout: 30000,
  use: {
    baseURL: "http://127.0.0.1:3111",
    browserName: "chromium",
    launchOptions: {
      executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    },
  },
  webServer: {
    command:
      "python3 scripts/serve-static.py --directory .cms-test-export --port 3111",
    url: "http://127.0.0.1:3111",
    reuseExistingServer: false,
  },
});
