import { spawnSync } from "node:child_process";
import { cp, rm, readFile } from "node:fs/promises";
import path from "node:path";
function run(command, args, env = process.env) {
  const result = spawnSync(command, args, { env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(`${command} exited ${result.status}`);
}
let built = false;
try {
  run("npm", ["run", "build:static"], {
    ...process.env,
    SANITY_PROJECT_ID: "example",
    SANITY_DATASET: "production",
    SANITY_READ_TOKEN: "",
    NODE_OPTIONS: `${process.env.NODE_OPTIONS || ""} --require=${path.resolve("tests/helpers/cms-fetch-fixture.cjs")}`,
  });
  await rm(".cms-test-export", { recursive: true, force: true });
  await cp(".next-static", ".cms-test-export", { recursive: true });
  built = true;
  const html = await readFile(".cms-test-export/index.html", "utf8");
  if (
    html.includes("PRIVATE_DRAFT_TEST_MARKER") ||
    !html.includes("Content controlled from the dashboard")
  )
    throw new Error("CMS publication fixture failed.");
  run("ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-f",
    "lavfi",
    "-i",
    "color=c=0x69745a:s=160x100:r=12",
    "-t",
    "2",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    ".cms-test-export/test-clip.mp4",
  ]);
  run("npx", ["playwright", "test", "--config", "playwright.cms.config.ts"]);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  // Never leave synthetic CMS content in the real delivery output.
  if (built) await rm(".next-static", { recursive: true, force: true });
}
