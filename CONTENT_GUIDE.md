# Editing Studio Da'lo

Content is separated from layout. You do not need to change components to add a project, category or image.

## Identity and biography

Edit `lib/settings.ts` for the public name, designer, descriptive copy, biography, approach and capabilities. The public name is **Studio Da'lo**. Darlington is described as **Architectural Designer**. Do not add ARB-registration claims, unconfirmed qualifications, employers, testimonials or awards.

`brand.email` and `brand.instagram` are empty. `brand.siteUrl` is set to the current Netlify origin. Only the configured email is currently rendered as a link. Social navigation can be added when a genuine destination is approved; no invented social links exist. Set `siteUrl` to the actual HTTPS production origin before social-preview/canonical testing. The current layout includes `robots: { index: false, follow: false }` because it is a demonstration; revisit only after content approval.

## Replace the demonstration slots

The eight public slots in `lib/project-source.ts` are visual placeholders, not claims about completed work. The additional unpublished fixture is a publication safeguard and must stay unapproved or be removed. To replace the source with a real collection, create an array of `Project` records conforming to `lib/types.ts`.

Each record has:

- Stable `id`, unique URL-safe `slug`, accurate `title`, `discipline` and `sector`.
- Optional real `year`, `location` and design/construction `status`. Omit unknown values. The interface does not invent dates.
- `introduction`, with optional `overview`, `challenge`, `approach` and `outcome`. Only supplied narratives should be included.
- `role`, `contribution`, `practice` and `collaborators`, when confirmed.
- `hero` and a `gallery` array. Each media entry needs `src`, `type`, `width`, `height`, `aspectRatio`, useful `alt`, `caption` and `credit`.
- `featuredOrder` for ordering, `approved` for publication, `placeholder` to distinguish demo content, and search `tags`.

The first gallery entry represents the hero; subsequent entries render in the gallery. Keep that convention when replacing content. A media `type` can be `image`, `drawing` or `video`. Use actual pixel dimensions, and set `aspectRatio` to width divided by height. Choose a deliberate crop for hero media; case-study galleries contain uncropped enlargement views. Use `type: 'drawing'` for plans/sections; SVG or a sufficiently large image works well.

### Example record (template, not a commission)

```ts
{
  id: 'confirmed-project-id',
  slug: 'confirmed-project-slug',
  title: 'Confirmed project title',
  discipline: 'Architecture',
  sector: 'Residential',
  introduction: 'Approved project introduction.',
  role: 'Confirmed role',
  contribution: 'Confirmed scope',
  practice: 'Confirmed employing practice or independent context',
  hero: {
    src: '/media/approved-project/hero.webp', type: 'image',
    width: 1600, height: 1200, aspectRatio: 1600 / 1200,
    alt: 'Describe what this approved image shows.',
    caption: 'Approved project caption.',
    credit: 'Confirmed photographer / rights-holder and permission.'
  },
  gallery: [/* hero entry, followed by approved images and drawings */],
  tags: ['courtyard', 'stone'], featuredOrder: 1,
  approved: false, placeholder: false
}
```

Leave `approved: false` until project narrative, role, employment context, image rights and public-display permission are all confirmed. Approval is a content decision, not just a software flag. `getProjects()` and `getProject()` exclude unapproved records before passing data to the browser, generating routes, or creating project metadata. Search and adjacency apply the same approval filter. Do not import `project-source.ts` into client components.

**All files in `public/` are publicly reachable.** Never put confidential or unapproved images there, even for an unpublished record. Keep source/private material outside `public` and outside tracked assets intended for deployment. The generator creates only this demo’s original illustrations; it does not copy project-source files into the public directory. A future CMS must enforce approval at the asset/query boundary too.

## Roles and work at a practice

Use this structure prominently for work completed with another practice:

“Role: [confirmed role]. Undertaken while at [practice]. Contribution: [confirmed scope]. Images: [credit].”

These fields already render in every story. Do not describe such work as a Studio Da'lo commission. Unknown fields remain explicit completion prompts only in demo mode. Complete them before public launch.

## Add a category or adjust the collection

Discipline buttons, counts and form options derive from approved data. Architecture, Interiors and Design are the initial categories. New discipline strings create an additional filter automatically. Sector and tags are searchable along with the title and discipline. Use consistent spelling and casing in source data. Wall and Index use exactly the same result set. Sorting uses `featuredOrder`.

## Add media

Use approved, locally bundled WebP/JPEG/PNG images for ordinary imagery. Include source/permission notes in `MEDIA_CREDITS.md`. The runtime uses Next.js image optimisation, explicit intrinsic dimensions, responsive sizing, lazy loading and an eager hero. The bundled WebP sources remain editable/replacable.

For an actual optional clip, set `type: 'video'`, a local `src` and a readable local `poster`. Native controls are available in the story. In card previews, footage is muted, inline, opt-in, with `preload="none"`; it pauses offscreen and on hidden pages. No video footage is included in the demo. Still-image motion is labelled as such. Test posters, autoplay rejection, codecs, bandwidth, accessibility and fallbacks with actual supplied footage before relying on video support.

A failed image or clip renders a readable description instead of an empty box. Drawings can be opened uncropped in a nested modal and at full original size. On small screens the large drawing view scrolls horizontally, deliberately, inside the dialog only.

## Enquiry delivery

The form validates locally, never sends an enquiry, never writes form data to localStorage, and never logs it. `deliverEnquiry()` returns `{ mode: 'demo' }` after a brief pending state. The UI says the enquiry has not been sent. The only stored preference is Wall/Index, under `dalo-view`.

To connect delivery, implement a server-side API/provider adapter; keep credentials out of browser code. Revalidate on the server, constrain accepted project references and types, add abuse protection/rate limiting, handle real pending/failure/delivery outcomes and review privacy/retention copy. Do not simply change the demo confirmation text to “sent.” Only report delivery once a configured provider has accepted the message. No credential is needed for the local build.

## Sanity editor

The editor and integration are now implemented; account connection is pending. Follow `EDITOR_SETUP.md`. `lib/content.ts` supplies published content from `lib/cms.ts` to pages, metadata and the site-wide settings provider. `lib/projects.ts` remains the bundled demonstration source when unconfigured or deliberately in bootstrap mode. Do not import raw project-source records into clients.

Use Sanity’s Website settings and Projects editor once connected. Draft document changes stay out of public builds; Sanity media URLs are public to anyone with the URL, so confidential media must stay outside this library. Configured API failures stop the build instead of silently falling back to old examples.

## Validate after editing

Run `npm run check`, `npm run build`, and `npm run test:e2e`. Check actual images, credits, long titles, direct project URLs, keyboard access and mobile layouts. Tests currently expect eight demo slots and their known counts; update fixture-specific expectations deliberately when replacing the collection, while keeping approval and journey assertions meaningful.

## Broader redesign — 25 October 2026

The main editable content boundary is unchanged. `brand.name` and `brand.wordmark` control the Studio Da'lo name; the genuine Netlify origin is configured as `brand.siteUrl`. The current `generated` mapping in `lib/project-source.ts` connects eight fictional AI-generated covers to their correct dimensions, alt descriptions and credits. Replace it or provide explicit real media records when approved work arrives. Preserve the first-gallery-entry/hero convention.

On cards, a labelled placeholder's numeric suffix is shortened visually; the full title remains in its project metadata and accessible story heading. The visible story eyebrow still identifies the placeholder number. Do not remove demonstration disclosures while the images/narratives are fictional.

The cinematic opening currently draws scenes from approved project positions 1, 2 and 6. If the collection order or size changes significantly, adjust that selection in `components/cinematic-hero.tsx`. Only approved project records reach the component. The opening uses still images, not film footage. The still reel and collection motion honor reduced-motion/data-saving preferences.

See `REDESIGN_NOTES.md` for the new component and styling boundaries and `MEDIA_CREDITS.md` for generated-image provenance and the included font licences. The source TTF/WOFF2 files are bundled; ordinary setup does not require font-conversion tools.

## Readability update — 25 October 2026

Visible site text has a 20px minimum at default browser settings. Former 12px labels are 24px; the opening STUDIO label is 28px on desktop and 24px on phones. Controls, captions, project details, form labels and footer text share the readable baseline. Mobile cards use one column and text wraps rather than shrinking. The larger editor preset increases the rem baseline to 18px, giving a 22.5px minimum. Preserve these limits when adding styles or content.

## Balanced typography correction — 25 October 2026

The owner found the doubled typography too large. This supersedes the earlier 20px minimum. Supporting labels and captions now have a 16px minimum; prose is 18–20px. Navigation is 18px, project titles are 20–22px, and display headings retain their hierarchy. The header mark stays enlarged (46px desktop/42px phone); STUDIO above the hero is 24px desktop/22px phone. The Balanced editor preset uses these defaults; Larger increases the rem baseline by 12.5%. Regression checks enforce both the 16px floor and the 18–20px prose range, so accessibility fixes do not inadvertently enlarge all the copy again.
