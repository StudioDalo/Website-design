# Studio Da'lo — broader redesign, 25 October 2026

This is the broader source-informed design pass requested after the first portfolio prototype. The existing Studio Da'lo identity and project-portfolio purpose are retained. This is an original interpretation of Oasis's interaction ideas, not a copy of its brand, assets, fonts or source code.

## What changed

- A full-viewport wordmark shows architectural imagery through the letters. Native scrolling grows an aperture into a complete scene and brings in a new editorial statement. A visible Work shortcut skips the sequence immediately.
- Three mood images form a still-image reel. The user can pause it or choose the next image. Cycling stops offscreen, on hidden pages and when the reveal reaches its caption. Reduced-motion/data-saving preferences produce a static opening.
- The floating navigation changes tone over the scene and remains reachable. The mobile menu retains native modal focus handling.
- New locally bundled, clearly labelled AI-generated mood imagery replaces the original illustrated covers. No actual project authorship is claimed.
- Manrope and Instrument Serif establish the typography. Both are locally hosted and OFL licensed. WOFF2 conversion keeps the three shipped font files to approximately 109 KB combined.
- The editorial gallery has staggered imagery, short visual titles and animated filter/reflow/view changes through the browser's Web Animations API. The full placeholder titles remain in metadata and accessible project headings. Wall/Index filtering and persistence remain shared.
- Project stories now open as substantial sheets: media beside the narrative/facts on desktop; image before details on phones. The hero can be enlarged uncropped. Role/context templates stay prominent.
- The About, approach, interlude, enquiry and footer sections were restyled. Enquiry delivery remains local demo mode, and the submit button is disabled until JavaScript is available, preventing native no-JavaScript form submission.

## Main editable files

`components/cinematic-hero.tsx` owns the hero's scroll geometry and reel. It updates SVG/CSS properties in animation frames without React state updates on every scroll. It does not intercept wheel/touch scrolling or require GSAP/Lenis.

`components/collection-motion.ts` implements the gallery's before/after layout transitions. `components/motion-preference.ts` shares reduced-motion/data-saving preference detection.

`app/globals.css` contains the responsive visual system. `app/layout.tsx` self-hosts the licensed local fonts. `lib/project-source.ts` maps the approved demonstration covers to generated media. `lib/settings.ts` remains the brand/profile boundary.

`node scripts/capture-redesign.mjs` starts its own static test server on port 3130, captures desktop/mobile opening, transition, revealed scene, gallery, project, drawing, About and contact states, and writes browser observations. It stops only its own server when finished.

## Scope and limits

The supplied reference source establishes the wordmark/window, scroll scene, reel, collection and sheet concepts. A rendered reference-browser comparison is still blocked by certificate trust in this environment; certificate verification was not disabled. The result is source-informed and independently tested, not a claim of pixel-identical reference reproduction.

The eight projects remain demonstration slots. Real project images, narratives, confirmed roles/practices, media permission and actual enquiry delivery are still needed for a genuine portfolio launch. Tests emulate browser viewports rather than real iOS/Android hardware. No performance-audit score is claimed.

The upload package updates the existing Netlify project when its owner uploads it through Deploys. A GitHub ZIP upload alone does not change the live Netlify website.

## Readability and editor preparation — 25 October 2026

The 20px minimum applies to visible website text at default settings, including navigation, controls, captions, metadata, project sheets and forms. Former 12px labels are 24px. The header mark is 46px on desktop/42px on phones; STUDIO is 28px/24px. Layouts accommodate the larger text with wrapping, adaptive columns and one-column phone cards. Darker muted text and a stronger hero scrim improve contrast. Native scroll, the circular opening and reduced-motion behavior remain.

The prepared Sanity editor is isolated in `studio/`; the public portfolio does not load that package. Website settings are passed through a server-provided context; media supports CMS focal points and an optional paused/muted hero film. The Netlify build wrapper, approved-only example import, singleton settings, project content preview and publication validation are implemented. No real account or webhook has been connected or tested. See `EDITOR_SETUP.md` for the remaining owner setup.

## Typography rebalanced after owner review

The initial universal 20px floor and doubled 24–28px paragraphs overwhelmed the composition. The revised scale uses 16px supporting text and 18–20px prose while retaining display headings, enlarged marks, local fonts, contrast and wrapping. The circular reveal, images, project behavior and standalone Sanity setup are unchanged.

## Oasis-inspired refinement — 26 October 2026

The approved plan is implemented in `app/refinements.css` and the existing components. The navigation is a centred glass pill (760×64px at the standard desktop viewport), the hero opening is simpler, and the route to the gallery is shorter. The circle and original generated imagery remain central. Collection controls use a compact phone layout and cards use deliberate image proportions.

Motion now has a shared easing curve, restrained button feedback, loaded-image-aware reel timing, staged caption arrival and a settled image while reading. Section entrances only translate content; body copy remains visible. The reel pauses offscreen/hidden and honours reduced-motion/data-saving preferences. Project sheets enter and exit smoothly; native modal focus/inertness and browser history remain intact, including focus restoration when returning to a fragment URL.

The owner’s approved Instagram profile, @studiodalo_london, appears in the footer and mobile navigation. It is editable in the standalone Studio. No real account data was modified and no publishing webhook was created. The temporary Netlify deployment still needs the owner to upload the supplied archive until automatic publishing is connected.
