# Open and update Studio Da’lo

The owner authorised temporary public deployment on 24 October 2026. The existing website address is **https://imaginative-belekoy-450f0d.netlify.app**. No paid purchase, domain registration or real enquiry delivery is configured.

## Update the existing website in a browser

1. [Download the tested website ZIP](https://github.com/StudioDalo/Website-design/raw/808fd2c6dc47d8364b47496386864189a238d545/studio-dalo-upload.zip).
2. On Windows, right-click the ZIP and choose **Extract All**. Inside is a folder named **studio-dalo**.
3. Open your existing Netlify project **imaginative-belekoy-450f0d**, then **Deploys**.
4. Upload the entire new **studio-dalo** folder in the manual deployment area. Wait until Netlify reports success.
5. Open the same website address above. The current version changes only after the upload succeeds.

This package includes the compact floating header, refined circular reveal and reel, earlier project browsing, readable typography, @studiodalo_london links, eight labelled generated studies and a standalone editor at **/admin/**. Sanity project identifiers are configured for **eurg3hlb / production**. Complete the Sanity CORS/login steps, then import the current collection through Getting started in the editor. The public portfolio retains its bundled collection during this setup.

The ZIP download has been fetched via HTTPS, checked byte-for-byte against the local build and verified as a valid archive. Workspace file links do not work as downloads in the owner’s ChatGPT browser.

## Enable editing and automatic publishing

Follow [EDITOR_SETUP.md](EDITOR_SETUP.md). Connect the **existing** Netlify site to this repository’s **main** branch, use the supplied build configuration, finish the initial import and then set **SANITY_CONTENT_ENABLED=1**. A Sanity publication webhook starts subsequent Netlify builds. No repeat ZIP uploads are needed after that connection works.

Keep the hook URL and any private-dataset viewer token in the account settings rather than the repository or browser bundle. A failed build retains the previous successful site. Netlify’s deployment history provides rollback. The assistant cannot sign in to the owner’s accounts; actual login, import, webhook and publish-to-live checks remain pending.

## Rebuild and verify

```sh
npm run check
npm run build:netlify
STUDIO_DALO_TEST_STATIC=1 npm run test:e2e
npm run package:static
```

Next 16.4 writes the complete static export to **.next-static/**. The upload ZIP contains only public export files and host header instructions, with a top-level studio-dalo folder. It contains no source, credentials, Git metadata, node_modules or unapproved fixture.

`npm run build:netlify` also builds the standalone Studio when identifiers are present and includes the approved-only example import JSON. `npm run build:static` alone builds only the public Next website. `npm run test:cms` uses a synthetic dataset response and removes its synthetic export afterward; always rebuild normally before packaging.

The contact form remains demo-only and never reports an enquiry as delivered. Pages remain noindex while the content is a demonstration. Physical-device and real account/hosting checks are distinct from local browser verification.
