import { spawnSync } from "node:child_process";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
const project = JSON.parse(await readFile(new URL("../sanity-project.json", import.meta.url), "utf8"));
const env = {
  ...process.env,
  SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID || project.projectId,
  SANITY_DATASET: process.env.SANITY_DATASET || project.dataset,
  SANITY_CONTENT_ENABLED: process.env.SANITY_CONTENT_ENABLED ?? (project.contentEnabled ? "1" : "0"),
  NEXT_TELEMETRY_DISABLED: "1",
  SANITY_TELEMETRY_DISABLED: "1",
  npm_config_cache:
    process.env.STUDIO_DALO_NPM_CACHE ||
    process.env.npm_config_cache ||
    path.resolve(".cache/npm"),
};
function run(command, args, cwd) {
  const result = spawnSync(command, args, { stdio: "inherit", env, cwd });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
run("npm", ["run", "build:static"]);
run("node", ["--import", "tsx", "scripts/build-content-seed.ts"]);
if (env.SANITY_PROJECT_ID && env.SANITY_DATASET) {
  env.SANITY_STUDIO_PROJECT_ID = env.SANITY_PROJECT_ID;
  env.SANITY_STUDIO_DATASET = env.SANITY_DATASET;
  // A read token belongs only to the server build, never to Studio's public bundle.
  delete env.SANITY_READ_TOKEN;
  run("npm", ["ci", "--no-audit", "--no-fund"], "studio");
  run("npm", ["run", "typecheck"], "studio");
  run("npm", ["run", "build"], "studio");
} else {
  await mkdir(".next-static/admin", { recursive: true });
  await writeFile(
    ".next-static/admin/index.html",
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Studio Da'lo editing</title><body style="background:#f5f2ea;color:#1d3028;font:22px/1.6 Arial,sans-serif;max-width:720px;margin:10vh auto;padding:24px"><h1>Studio Da’lo</h1><p>Your editing dashboard is awaiting its account connection.</p><p>The public portfolio is available as usual.</p><a href="/">Return to the website</a></body></html>`,
  );
}
