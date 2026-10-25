# Studio Da'lo — current QA report

**Version:** broader Oasis-inspired redesign, 25 October 2026.

## Result and scope

The local demonstration portfolio passes its static export, normal production build, TypeScript, ESLint, nine data/validation tests and 22 browser journeys in both hosting modes. No tests are skipped or marked expected-failure. Desktop/mobile screenshot journeys record no page errors, console errors, failed responses or document overflow.

This is the broader visual/behavioral redesign, not only a name change. It introduces the image-filled wordmark, native-scroll aperture, still-image reel, editorial collection/reflow and split desktop/media-led phone project stories. The public name remains **Studio Da'lo**.

The eight project records are deliberately labelled demonstration slots. Their covers are original AI-generated fictional mood studies, not Darlington's projects. The form validates/previews locally and does not send messages. The current public Netlify website is not changed by building or uploading a ZIP to GitHub; its owner must upload the refreshed folder through that existing project's Deploys page.

## Verification

| Check | Outcome |
| --- | --- |
| TypeScript `tsc --noEmit` | Passed |
| ESLint | Passed, no source lint errors or warnings |
| Nine data/validation tests | 9 passed; 0 failed/skipped |
| `npm run build:static` | Passed; eight approved project routes exported |
| Static browser suite | 22 passed; 0 failed/skipped |
| Normal `npm run build` | Passed |
| Normal server browser suite | 22 passed; 0 failed/skipped |
| Desktop/mobile capture journeys | No page errors, console errors, failed responses or document overflow |
| Upload packaging | ZIP integrity, project pages, entry HTML and publication-fixture exclusion checked |

Commands, from `/workspace/Website-design`:

```bash
npm run check
npm run build:static
STUDIO_DALO_TEST_STATIC=1 npm run test:e2e
node scripts/capture-redesign.mjs
npm run package:static

# Ordinary Next.js workflow is also verified:
npm run build
npm run test:e2e
```

The two browser modes use an isolated server on port 3100 and refuse an existing server. Screenshot capture owns a separate static server on port 3130 and stops that server when finished. Stop old production preview processes before rebuilding their `.next` output; do not serve stale asset manifests across rebuilds.

## Data and browser coverage

The data suite checks approval before public access, category counts, case-insensitive title/sector/tag search, configurable disciplines, filtered/wrapping neighbors, accessible credited media/dimensions, enquiry validation, honest demo delivery and nonmutating featured ordering. The unpublished fixture remains absent from public queries, routes, home HTML and public client output.

The browser suite checks:

- Shared filters, counts, title/tag search, reset/empty state, Wall/Index parity, saved preference, malformed JSON and disabled localStorage.
- Project opening, explicit/native background inertness, keyboard focus containment/restoration, Escape, nested drawing enlargement, uncropped media, filtered previous/next, browser Back/Forward and project-linked Contact.
- Direct project URLs, refresh, item-specific title metadata, full-set direct-page neighbors and useful unknown/unpublished HTTP 404 responses.
- Required/email validation, first-error focus, pending state, exact unsent-demo outcome, project-context removal, absence of outbound enquiry requests and absence of form data in browser storage.
- Real clipboard copy/rejection handling. Native sharing success and cancellation use controlled API stubs because a platform share sheet is unavailable in headless Chromium.
- Opt-in still previews, Off behavior, offscreen/hidden-page pausing, reduced motion and data-saving preference changes. A deliberately failed image request verifies the readable fallback.
- Long-title wrapping, mixed image ratios and the updated desktop/phone project arrangement.
- **320×800, 390×844, 768×1024, 1024×768 and 1440×900**: document/dialog overflow, reachable navigation/close controls, visible Work shortcut, project opening/navigation/closing and page errors.
- The native-scroll wordmark aperture, revealed caption/header tone and working shortcut out of the sequence.
- Hero image-reel pause/manual-next controls, hidden-page/offscreen pausing and the reduced-motion static opening.
- Running gallery reflow animation when allowed and absence of it under reduced motion. Related geometry is sampled in one browser frame so entry animations cannot create a measurement race.
- No-JavaScript static wordmark, native project navigation, readable direct stories and disabled demo submission.

The original 17 portfolio journeys remain, with assertions adapted to the deliberate shortened visual titles while checking full accessible titles/metadata. Five new redesign journeys exercise the new interaction behaviors. No assertions were disabled to make the suite pass.

## Rendered review

`scripts/capture-redesign.mjs` creates 1440×900 and 390×844 captures for opening, transition, revealed scene, collection, project, drawing, About and Contact. See `artifacts/redesign-*.png` and `artifacts/redesign-observations.json`. The wordmark, disclosure, typography, gallery spacing, full scene, image-led phone sheet and sticky close control were visually inspected.

These are Chromium viewport-emulation checks, not real iOS/Android/Safari testing. No screen-reader certification, comprehensive accessibility audit, Lighthouse score or real-user performance result is asserted. Self-hosted WOFF2 font files total about 109 KB; that is an asset size, not an audit score. Actual film footage is not supplied or represented: the reel and Motion Previews are still images.

## Reference, provenance and launch limits

Oasis HTML/CSS/JavaScript was reachable for source analysis. Its wordmark/window, scroll scene, still reel, collection and sheet concepts informed this original interpretation. Chromium reference rendering is still blocked by certificate trust here; TLS checks were not disabled. A rendered, pixel-by-pixel reference equivalence claim is not made.

No Oasis branding, proprietary fonts, media or source code is used in the website. Eight original generated mood images, original illustrative drawings and OFL-licensed Manrope/Instrument Serif are bundled locally. Their notices and provenance are recorded in `MEDIA_CREDITS.md`; the font licences are included in the upload.

Before a genuine portfolio launch, replace the demonstration collection with approved work, confirmed roles/contributions/practice context, public-display permission and proper media credits. Complete the approved biography and genuine contact destinations. Real enquiry delivery requires a server-side provider, server validation, abuse protection and reviewed privacy/retention wording. CMS integration is a later replacement of `lib/projects.ts`. The demo remains noindex.

## Delivery

The compiled upload is `studio-dalo-upload.zip`, containing a top-level `studio-dalo` folder with the complete website. Only exported public assets and Netlify response-header configuration are packaged. No source folders, credentials, Git metadata, node_modules, private media or reference-analysis artifacts are included.

`DEPLOYMENT.md` explains updating the existing Netlify project. `REDESIGN_NOTES.md` documents the new component boundaries. `CONTENT_GUIDE.md` explains replacement of the fictional content. `artifacts/QA_REPORT_before_redesign.md` retains the earlier prototype QA history.

The latest ZIP is delivered through a real GitHub HTTPS download, which is checked for a successful response, archive integrity and byte-for-byte equality with the tested local package. Netlify publication and its assigned live response remain separate from this local verification.

## Readability and Sanity preparation — 25 October 2026

Current checks supersede the earlier 22-journey count:

- TypeScript, ESLint and all 15 data/CMS unit tests pass.
- Normal production build and all 27 browser journeys pass.
- Static production build and all 27 browser journeys pass.
- New checks enforce a 20px minimum for visible website text at 320, 390, 768 and 1440px, including project sheets and Index; 200% text enlargement remains usable without page/dialog overflow. Existing responsive checks include 320×800, 390×844, 768×1024, 1024×768 and 1440×900.
- Three additional isolated CMS browser journeys pass: published content/new routes/settings render, draft markers stay absent, actual test MP4 plays muted and pauses manually/offscreen, reduced motion uses a still without a hero film download. Project gallery videos retain native controls outside buttons.
- Clean frozen installation, separate TypeScript check, schema extraction and Studio production compilation pass. Studio is isolated from the portfolio’s dependencies. TypeScript 6 and React 19.3.1 satisfy current editor dependencies; the existing public Next app remains on TypeScript 5.9.3 / React 19.2.4.
- The configured Netlify build wrapper is tested in bootstrap mode; it compiles the editor, preserves the bundled eight public studies and emits an approved-only example import file. A unique request tag prevents a restored fetch cache from serving the previous publication on a new CMS build.

The owner supplied public project ID `eurg3hlb`, dataset `production`. Login, member permissions, CORS, media import, webhook triggers and actual publish-to-Netlify remain account-dependent and have not been verified. Direct Sanity API access is blocked by this environment’s outbound proxy (HTTP tunnel 403); this is not evidence of an account fault. No real CMS document or asset was written by the assistant. No paid service was purchased.

The enquiry form remains local demo-only. No real delivery or stored enquiry system is configured. Browser tests use desktop Chromium with emulated viewport/preferences, not physical iOS/Android devices or a screen-reader certification.

The final standalone editor build verifies all seven entry assets resolve under `/admin/`, including favicon paths, and allows browser zoom. The owner reports saving the website origin with credentials enabled in Sanity CORS; browser sign-in and publishing are still awaiting the new Netlify upload.

A separate editor browser check loads the real compiled `/admin/` entry, checks local chunks/styles for HTTP errors and verifies the sign-in return address stays `/admin/`. This test mocks the unauthenticated Sanity API boundary; it confirms deployment routing without claiming a real sign-in. No page errors or failed local responses were recorded.

## Typography correction after owner feedback — 25 October 2026

The earlier universal 20px floor is superseded. The Balanced preset now uses 16px supporting text and 18–20px prose; large headings, enlarged marks and the circular reveal are retained. All 15 unit/data checks and lint/type checks pass. The static production build and all 27 browser journeys pass, including the revised 16px floor, an upper bound of 20px on ordinary prose at default settings, and 200% text enlargement. The editor builds with updated preset descriptions; its isolated sign-in-route check passes (authentication API mocked, not a live account login). Desktop/phone captures record no page/console errors, failed local responses or page overflow.
