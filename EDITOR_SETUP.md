# Your Studio Da’lo editing dashboard

The website readability update is ready to upload independently. The editing dashboard is built, but is **not connected to a real account yet**. The owner has created project `eurg3hlb`, dataset `production`; those public identifiers are saved in `sanity-project.json`. No paid plan, credentials, hosting connection or webhook has been created on your behalf.

## First: create your own Sanity project

1. Open [Sanity](https://www.sanity.io/) and create an account.
2. In [Sanity Manage](https://www.sanity.io/manage), create a project called **Studio Da’lo**. Use a dataset named **production**. A public dataset is suitable for approved portfolio content; drafts require authentication. Check the current plan limits and choose a plan yourself—this code does not require purchasing one.
3. Send your assistant the **project ID** and **dataset name**. These two identifiers are public. Do not send passwords or API tokens in chat.

## Connect the existing Netlify site once

The website address stays **https://imaginative-belekoy-450f0d.netlify.app**. Work inside that existing Netlify project.

1. In Netlify, connect the project's continuous deployment to **StudioDalo/Website-design**, branch **main**. The supplied `netlify.toml` sets the build command and output folder. Connect the existing site rather than creating another site.
2. The supplied public identifiers already configure the dashboard. These environment variables can override them in Netlify:

   | Name | Value |
   |---|---|
   | `SANITY_PROJECT_ID` | Your project ID |
   | `SANITY_DATASET` | `production` |
   | `SANITY_CONTENT_ENABLED` | `0` initially |

   The default `0` in `sanity-project.json` keeps the current demonstration collection visible while you prepare the editor. The dashboard connects to your account immediately after the build, but the public portfolio still uses its bundled collection.
3. For a **private dataset**, add a Sanity **viewer** token as `SANITY_READ_TOKEN` using Netlify's secret environment settings. Never commit it or prefix it with `NEXT_PUBLIC_` or `SANITY_STUDIO_`. No token is needed for published reads from a public dataset.
4. In Sanity project settings, add **https://imaginative-belekoy-450f0d.netlify.app** as a CORS origin with credentials allowed. Add only your actual site origin. For local dashboard development, add `http://localhost:3333` separately if needed.
5. Trigger a Netlify deployment. Once successful, open **https://imaginative-belekoy-450f0d.netlify.app/admin/** and sign in to your Sanity account. Only invited project members with appropriate permissions can edit.
6. Open **Getting started**, tick the import confirmation and press **Import demonstration collection**. This uploads the existing example media and creates eight demonstration projects plus website settings. Stable IDs prevent overwriting edits if the import is retried. Keep these fictional studies labelled as demonstrations.
7. Check Projects and Website settings. Then change `SANITY_CONTENT_ENABLED` to `1` in Netlify and deploy again. The public website now reads your published collection.

Do not enable CMS content before importing or adding projects unless you intend to display an empty collection. Unpublishing all projects is supported: the site does not silently restore old projects.

## Make Publish update the website automatically

1. In the existing Netlify project, create a **build hook** for branch **main**. Treat its URL as a private publishing credential; do not put it in the source repository or browser code.
2. In the Sanity project's API/Webhooks settings, add a POST webhook pointing to that hook. Enable create, update and delete events for **published** documents. Leave draft/version events disabled.
3. Limit it to document types `project` and `siteSettings` (GROQ filter: `_type in ["project", "siteSettings"]`). Publish, unpublish and delete a test project to verify each trigger before relying on it.
4. Publish a small text change and watch the Netlify Deploys tab. A successful build updates the site; a failed build leaves the last successful version live. Changes take a build to appear, rather than updating instantly.

Netlify provides deployment rollback. Sanity offers document history according to its plan; confirm the current retention limits. The assistant has not performed these live-account checks yet.

## Everyday editing

- **Add a project:** Projects → create → enter the title and generate its URL → add discipline, sector, introduction, images and credits. Complete the story and role information when known. Use a still image for the project cover; videos may go in the gallery.
- **Check before publishing:** use the project's **Content preview** tab. This shows its draft cover and text inside the authenticated editor. It is a content preview, not a full interactive website preview.
- **Publish:** enable **Approved for the public website**, then Publish. Draft changes stay out of the public build until published. Uncheck approval and Publish, or unpublish the document, to remove it on the next successful deployment.
- **Reorder:** change the Collection order number. Smaller numbers appear first.
- **Homepage:** Website settings → Homepage for headings, copy and images; About for biography; Approach for steps and capabilities; Identity for the contact email and studio identity.
- **Hero:** select Image sequence and choose up to six stills, or Short film and upload a compressed MP4/WebM, dimensions and poster. Aim for 6–12 seconds and under 8 MB. Video is muted, pausable and pauses offscreen. Reduced motion/data saving show the poster. The circular reveal is retained.
- **Fonts:** Appearance offers Manrope, system sans and Georgia for text; Instrument Serif, Georgia and Manrope for emphasis. The Balanced preset uses 16px supporting text and 18–20px body copy. The optional Larger preset increases those sizes by 12.5%. The brand wordmark remains Manrope to preserve its design.
- **Image crop:** use the image hotspot to choose its focal point. Full-image enlargement remains available in projects.

**Sanity media asset URLs are publicly retrievable by anyone who has the URL**, even when attached to a draft or a private dataset. Do not upload confidential client material to this media library. Draft document access and asset privacy are different things.

The enquiry form remains demonstration-only. Adding a public contact email gives visitors a real mail link; automatic email delivery needs a separate provider connection.

## Technical verification and boundaries

- `npm run check`, `npm run build`, `npm run build:netlify`, `npm run test:e2e`.
- `npm run test:cms` builds against a synthetic published-content response and runs isolated browser tests, including an actual muted test MP4. It removes synthetic `.next-static` output afterward; rebuild normally before packaging.
- `npm --prefix studio ci` and `npm --prefix studio run typecheck` verify the separate dashboard package. It does not add Sanity to the public site's client bundle.
- `lib/cms.ts` validates content and projects only approved published records into public output. An API/configuration/content error fails the build instead of replacing the live portfolio with a fallback. The deliberate bootstrap mode and completely unconfigured mode use the original demonstration collection.
- A fresh static build fetches the published dataset using Next's default build-time fetch policy. No runtime server, database password or public read token is required by the portfolio.
- `scripts/build-netlify.mjs` compiles the static website, prepares an approved-only example import file, and builds Studio at `/admin` when project identifiers are configured. It uses the supplied public identifiers by default, while retaining the bundled portfolio during bootstrap mode. If neither file configuration nor environment identifiers exist, it provides an honest account-connection message instead of a pretend login.
- Authentication, import write permissions, the real webhook and a real publish-to-live cycle still require your accounts and must be checked after connection.

The environment’s outbound proxy currently blocks direct requests to the real Sanity project API. This does not establish a problem with the account. Compilation and isolated CMS tests work here; the owner’s browser/Netlify must complete the real login, import and publishing checks.
