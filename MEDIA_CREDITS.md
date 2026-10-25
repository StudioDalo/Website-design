# Studio Da'lo — media and type credits

Updated 25 October 2026 for the broader Oasis-inspired redesign.

## Architectural mood imagery

The eight `*-render.webp` covers are original **AI-generated demonstration imagery** made for this project. They show fictional spaces, objects and model studies. They are not photographs of Darlington's work, completed commissions, clients' properties or real design outcomes. They were not taken from Oasis, a stock library, another designer's portfolio or private project folders.

The original generation outputs remain in `/workspace/generated_images/`. Optimised local WebP copies are bundled for the website; no paid account, image CDN or runtime image-generation service is required.

| Public asset | Purpose |
| --- | --- |
| courtyard-render.webp | Fictional limestone courtyard, olive tree and reflecting pool; first hero scene and Placeholder 01 |
| interior-render.webp | Fictional quiet interior and olive grove; second hero scene and Placeholder 02 |
| colonnade-render.webp | Fictional limestone colonnade and landscape; Placeholder 03 |
| objects-render.webp | Fictional travertine, olive ceramic, walnut and bronze composition; Placeholder 04 and About |
| workplace-render.webp | Fictional shared walnut table and courtyard workplace; Placeholder 05 |
| pavilion-render.webp | Fictional low garden pavilion; third hero scene, interlude and Placeholder 06 |
| stairs-render.webp | Fictional stone staircase with geometric daylight; Placeholder 07 |
| forms-render.webp | Fictional architectural model composition; Placeholder 08 |

The hero has a visible AI-generated demonstration disclosure. Cards are labelled “AI-generated study”; project captions and credits identify their provenance. The project records remain `placeholder: true`. No project authorship, employer, client, year or result has been invented.

## Original vector assets

`drawing.svg` is an original illustrative plan, labelled as a demonstration drawing with an illustrative scale. `detail.svg` / `detail.webp` is an original illustrated material palette. These are used in the demonstration project galleries and must be replaced by approved real drawings/process imagery for a genuine case study.

The earlier courtyard, interior, colonnade, objects, workplace, pavilion, stairs and forms SVG/WebP illustrations are retained as legacy editable demonstration assets; the current project covers use the new render files. The vector source generator is `scripts/create-media.mjs`. No legacy asset depicts an actual commission.

`app/icon.svg` and `components/icons.tsx` contain the original Studio Da'lo monogram and interface icons.

## Licensed, locally hosted fonts

The redesign uses **Manrope** and **Instrument Serif**, distributed under the **SIL Open Font License 1.1**. Their licence notices were read and are included in the upload under `font-licenses/`. Fonts load from the same site, not from Google or another external font service. Next.js uses the bundled WOFF2 copies; source TTF files remain in `assets/fonts/`.

- Manrope: Copyright 2018 The Manrope Project Authors. Source: https://github.com/google/fonts/tree/main/ofl/manrope
- Instrument Serif: Copyright 2022 The Instrument Serif Project Authors. Source: https://github.com/google/fonts/tree/main/ofl/instrumentserif

Original downloaded TTF SHA-256 digests:

| Source | SHA-256 |
| --- | --- |
| Manrope[wght].ttf | 3ae11c49db0455a3cc33e37d380f20fdb8c7f8b41dc07625c177e3d87a9d6ae6 |
| InstrumentSerif-Regular.ttf | 498efd461f6ddfcb7a111bf9a565709d2085d48201d501ead960d93e84ffbb88 |
| InstrumentSerif-Italic.ttf | 08939b8bdf534afec24ae0ef5e03f948940cd9a8fe08e7fecbad040e62327385 |

## Reference and replacement policy

Oasis HTML/CSS/JavaScript was reviewed for interaction concepts. Its proprietary fonts, logo, wording, photographs, films and application code are not used in the delivered website. The Studio Da'lo aperture, native scroll behavior, scene reel, gallery transitions and project layouts were independently implemented. Source-analysis artifacts under `artifacts/oasis-*` are not public website assets and are excluded from the downloadable source archive.

Before replacing any demonstration asset, record its creator, source, rights-holder, licence or express permission, attribution requirements and approval for public use. Keep confidential and unapproved media outside `public/`, regardless of a record's publication flag.
