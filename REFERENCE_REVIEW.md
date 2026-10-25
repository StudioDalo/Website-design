# Studio Dalo / Oasis reference review

23 October 2026. Reference requested: https://1128club.com/oasis

## Finding

Reference similarity has **not been verified**. Direct HTTPS requests to both `/oasis` and `/oasis/` received a 403 from the environment's egress proxy. That is an environment access restriction, not evidence that the reference site itself is unavailable. Browser access attempts at desktop and phone viewport sizes are recorded in `artifacts/reference-access-check.json`.

The previous QA sign-off covers the local application's implemented functionality. It does not establish visual or interaction fidelity to Oasis. No similarity score or claims about unobserved Oasis behavior are justified.

## Current implementation against the supplied written brief

| Intended direction or behavior | Studio Dalo implementation | Assessment |
| --- | --- | --- |
| Oversized typography, warm ivory, charcoal, editorial spacing | Large mixed sans/serif wordmark, ivory/green palette, image-led work collection | Present; stylistic match to the live reference unverified |
| Project imagery revealed through or around the wordmark | Static wordmark above a separate illustration frame | Partial interpretation; no animated wordmark/image reveal |
| Cinematic opening and restrained scroll transition into Work | Static opening composition, native anchor scrolling | Cinematic scroll choreography is absent |
| Wall/Index, search, filters and project discovery | Shared filtered results, counts, empty/reset states and saved view preference | Implemented and functionally tested; reference equivalence unverified |
| Substantial project overlays with coherent URLs and browser history | Native dialogs, focus handling, direct project pages and Back/Forward support | Implemented and functionally tested; reference layout/transitions unverified |
| Motion previews | Opt-in still-image movement; offscreen/hidden-page pausing and reduced-motion/data-saving handling | Implemented as still movement; no actual clips or reference animation matching |
| Project imagery carrying the visual experience | Original architectural illustrations in labelled demo slots | Placeholder visual experience; approved project photography is still needed |
| Phone behavior matching the intended experience | Own implementation tested at 320px and 390px, among other sizes | Local responsive behavior tested; no live-reference phone comparison |

## Required next step

`1128club.com` has been added to the saved network draft, preserving the existing package-manager preset. Saving the draft does not apply the runtime policy. Review/save the environment network setting and publish the environment configuration as required by the product. Retry the reference after the runtime access change; if its page uses additional asset origins, identify those actual destinations before adding them.

Once accessible, compare both sites at 1440×900 and 390×844: opening/load sequence, wordmark/media composition, scroll stages, collection layout and view transitions, hover/touch behavior, project opening/closing, history, keyboard handling and reduced-motion fallback. Only then can fidelity be signed off or a grounded redesign be specified.

No application UI was changed during this review.

## Source-access update — 24 October 2026

The reference HTML, stylesheet and script are now accessible through TLS-verified HTTP requests. Its source includes a 15-still hero reel, GSAP/ScrollTrigger and Lenis, a Wall/Index collection, a Previews control and a native detail dialog. These are source observations, not a completed rendered interaction review. Chromium still rejects the reference certificate in this environment; TLS verification was not disabled. A full visual/mobile fidelity sign-off remains outstanding.

The owner has deployed Studio Dalo at https://imaginative-belekoy-450f0d.netlify.app and reported that it opens. Independent requests to the Netlify homepage and a project route are blocked by the environment egress proxy, so the live deployment is user-confirmed rather than independently verified here. No site code was changed during this review.

## Broader redesign — 25 October 2026

The previous list of missing cinematic behavior is superseded by the new local implementation: an image-filled Da'lo wordmark opens through a native-scroll aperture into a full scene; the controlled still reel pauses appropriately; collection filtering/view changes reflow with animation; and project stories use a media/details split on desktop with imagery first on phones. The navigation, type, collection spacing, imagery and remaining sections were redesigned together. See REDESIGN_NOTES.md and the current QA_REPORT.md.

This remains an original, source-informed interpretation. No Oasis branding, proprietary fonts, media or source code is part of the application. A rendered reference comparison remains unverified because of the certificate-trust issue described above. Studio Da'lo itself is rendered, visually reviewed and tested at the documented viewports.
