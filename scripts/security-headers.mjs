import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
const root = path.resolve(".next-static");
async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const groups = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory()
        ? htmlFiles(path.join(dir, entry.name))
        : entry.name.endsWith(".html")
          ? [path.join(dir, entry.name)]
          : [],
    ),
  );
  return groups.flat();
}
const blocks = [];
for (const file of await htmlFiles(root)) {
  const rel = path.relative(root, file).replaceAll(path.sep, "/");
  const admin = rel.startsWith("admin/");
  if (admin && rel !== "admin/index.html") continue;
  const html = await readFile(file, "utf8");
  const hashes = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter((match) => !/\bsrc\s*=/.test(match[1]) && match[2].trim())
    .map(
      (match) =>
        `'sha256-${createHash("sha256").update(match[2]).digest("base64")}'`,
    );
  const script = [
    ...new Set([
      "'self'",
      ...hashes,
      ...(admin ? ["https://*.sanity.io", "https://*.sanity-cdn.com"] : []),
    ]),
  ].join(" ");
  const csp = [
    "default-src 'self'",
    `script-src ${script}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${admin ? "https:" : "https://cdn.sanity.io"}`,
    `font-src 'self' data: ${admin ? "https://*.sanity.io" : ""}`,
    `media-src 'self' blob: https://cdn.sanity.io`,
    `connect-src 'self' ${admin ? "https://*.sanity.io https://*.sanity-cdn.com wss://*.sanity.io" : ""}`,
    `frame-src ${admin ? "https://*.sanity.io https://*.sanity.studio" : "'none'"}`,
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
  ].join("; ");
  const route = admin ? "/admin/*" : `/${rel.replace(/index\.html$/, "")}`;
  const noindex =
    admin ||
    /<meta\b(?=[^>]*name="robots")(?=[^>]*content="[^"]*noindex)[^>]*>/i.test(
      html,
    );
  blocks.push(
    `${route}\n  Content-Security-Policy: ${csp}\n${noindex ? "  X-Robots-Tag: noindex, follow\n" : ""}`,
  );
}
blocks.push("/cms-seed.json\n  X-Robots-Tag: noindex, nofollow\n");
await writeFile(path.join(root, "_headers"), blocks.join("\n"));
console.log(
  `Generated scoped security headers for ${blocks.length - 1} HTML routes; inline scripts use SHA-256 hashes.`,
);
