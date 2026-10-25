# Studio Da’lo

A Next.js architectural portfolio with a circular scroll reveal, readable typography, original generated demonstration imagery and a prepared Sanity editing dashboard. The live domain remains https://imaginative-belekoy-450f0d.netlify.app. This checkout does not have access to the owner’s Netlify/Sanity accounts.

## Run and check

Use Node 24 and npm 11.

```sh
npm ci
npm run dev
```

```sh
npm run check
npm run build
npm run test:e2e
npm run test:cms
```

`test:cms` uses an isolated synthetic CMS response and a generated test MP4; it never contacts a real dataset. It removes its synthetic delivery output afterward. Rebuild normally before packaging. It requires ffmpeg and Chromium in the test environment. Ordinary setup/builds do not require ffmpeg.

## Deliver the static site

```sh
npm run build:netlify
STUDIO_DALO_TEST_STATIC=1 npm run test:e2e
npm run package:static
```

The upload ZIP contains a `studio-dalo` folder. Upload that whole folder in the existing Netlify project’s Deploys tab. A manual upload updates the public portfolio but does not connect accounts or enable automatic publishing. Workspace file links do not download in the user’s ChatGPT browser; publish delivery archives to the repository download branch and verify their HTTPS links.

## Editing backend

See [EDITOR_SETUP.md](EDITOR_SETUP.md) for the owner’s browser setup, `/admin/` login, initial import, font controls, video and automatic publishing. `netlify.toml` is ready for Git-connected builds on main. No paid service or real enquiry delivery is configured.

Public project identifiers for `eurg3hlb` / `production` are saved in `sanity-project.json`; publishing reads remain disabled during bootstrap. The standalone `studio` package has its own lockfile. Install with `npm --prefix studio ci`, then `npm --prefix studio run typecheck`. For local development copy `studio/.env.example` to `studio/.env.local`, set the two public identifiers and run `npm --prefix studio run dev`. The editor uses base path `/admin`.

`lib/cms.ts` validates a published-only projection and `lib/content.ts` supplies it to static pages, metadata and the settings context. Unconfigured builds retain the original demonstration data. Set `SANITY_CONTENT_ENABLED=0` while first importing the collection; set it to `1` when ready to use published content. Keep read tokens on the server only. Sanity media URLs are publicly accessible to anyone who has the URL, so do not upload confidential assets.

## Content and implementation

- [CONTENT_GUIDE.md](CONTENT_GUIDE.md): project content, credits and approval.
- [MEDIA_CREDITS.md](MEDIA_CREDITS.md): generated imagery, fonts and licences.
- [REDESIGN_NOTES.md](REDESIGN_NOTES.md): the original cinematic redesign and readability update.
- [QA_REPORT.md](QA_REPORT.md): validation and limits.
- [DEPLOYMENT.md](DEPLOYMENT.md): existing-site deployment and rollback.
- [REFERENCE_REVIEW.md](REFERENCE_REVIEW.md): source-informed Oasis review, without copied code/media.

The enquiry form is an honest local-only demonstration. A real contact email can be configured for a mail link. Provider-backed delivery requires a separate connection; it must not report “sent” while running in demo mode.
