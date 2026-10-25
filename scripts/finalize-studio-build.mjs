import { readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../.next-static/", import.meta.url));
const htmlPath = path.join(root, "admin/index.html");
const original = await readFile(htmlPath, "utf8");
// Current Sanity CLI emits favicon links at /static even for a configured subpath.
// Keep all of this standalone editor's assets under its /admin deployment path.
const html = original.replaceAll('href="/static/', 'href="/admin/static/').replace(', maximum-scale=1', '');
if (html !== original) await writeFile(htmlPath, html);
const assets = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)]
  .map((match) => match[1])
  .filter((url) => !url.startsWith("http") && !url.startsWith("data:"));
if (!assets.length || !assets.some((url) => /sanity-.*\.js/.test(url))) throw new Error("The compiled editor has no entry script.");
for (const url of assets) {
  if (!url.startsWith("/admin/")) throw new Error(`Editor asset escaped its deployment path: ${url}`);
  await access(path.join(root, new URL(url, "https://example.org").pathname));
}
console.log(`Verified ${assets.length} editor entry assets under /admin/.`);
