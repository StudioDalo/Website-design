# Deployment and publishing

The live website is https://imaginative-belekoy-450f0d.netlify.app/ and the standalone editor is https://imaginative-belekoy-450f0d.netlify.app/admin/.

## Current production connection

The owner connected the existing Netlify project to **StudioDalo/Website-design**, production branch **main**, and confirmed that Sanity Publish triggers a successful automatic build. Preserve that existing connection. The branch `studio-dalo-download-2026-10-24` is a historical download archive, not the production source.

| Setting | Value |
|---|---|
| Base directory | Repository root / empty |
| Package directory | Not set |
| Build command | `npm run build:netlify` |
| Publish directory | `.next-static` |
| Node | 24, supplied by netlify.toml |
| `SANITY_CONTENT_ENABLED` | `1` in the existing Netlify production environment |
| Sanity project / dataset | `eurg3hlb` / `production` |

For normal content updates, edit Sanity and Publish. Wait for Netlify's successful deployment before checking the public site. No ZIP upload is needed. A failed build leaves the previous successful deployment available; use Netlify's deployment history for rollback if needed.

Do not change the website address or canonical URL until the owner provides a purchased domain and it is connected. No paid service or real server-side enquiry provider is configured in this upgrade. Direct contact uses the configured public email and approved Instagram profile.

## Build output and security headers

`build:netlify` builds the static Next website, prepares the demonstration seed, installs/types/checks/builds the standalone Studio and generates per-route `_headers` from the actual exported HTML. Inline Next scripts use CSP SHA-256 hashes. The editor has a separate Sanity-compatible policy. Netlify post-processing is disabled to prevent changes invalidating those hashes. Common security headers are configured in netlify.toml.

Never put private API tokens or build-hook URLs in source, public files or chat. If a private dataset requires a read token, it belongs in Netlify's secret environment settings as `SANITY_READ_TOKEN`. It is removed from the Studio build environment. No read token is needed for published reads from a public dataset.

## Local verification

```sh
npm run check
NEXT_TELEMETRY_DISABLED=1 npm run test:cms
STUDIO_DALO_NPM_CACHE=/workspace/.npm-cache npm run build:netlify
STUDIO_DALO_TEST_STATIC=1 npm run test:e2e
npm run test:editor
```

The CMS test uses synthetic content and removes its temporary main export afterwards. Rebuild normally before packaging or serving the actual output. Account login and live webhook behaviour must be distinguished from mocked API checks.

`npm run package:static` remains available for exceptional manual delivery after the full build; it requires the generated security headers. Do not upload a local demonstration build over the owner's live CMS-backed site. The current source is deployed through main.

Google Drive imports are deferred. See UPGRADE_2026-11-18.md for completed features, security findings and access limitations.
