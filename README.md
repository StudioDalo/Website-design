# Studio Da’lo — corrected demonstration content import

Download and extract studio-dalo-upload.zip, then upload the whole studio-dalo folder in your existing Netlify project's Deploys tab. The website address stays https://imaginative-belekoy-450f0d.netlify.app.

This update stops two obsolete image-selection helper fields (top-level art and alt) from reaching Sanity project documents. The demonstration source and generated seed omit them, and the authenticated importer accepts only supported project fields, even from an older seed file. Current cover/gallery image descriptions remain intact. Existing documents and edits are preserved by createIfNotExists; deploying does not migrate or overwrite your Sanity records.

If your earlier import shows Unknown fields found, expand Developer info and use Remove field for only the two top-level art and alt entries. Keep the Image description fields inside your cover and gallery. Do not delete projects or repeat the import to clear the warning.

Validation: TypeScript/ESLint, 18 unit/data tests, the configured static/standalone Studio production build, all 35 website browser journeys and the isolated editor sign-in-route/asset check (authentication API mocked). The generated seed contains eight approved fictional projects with cover/gallery descriptions and no obsolete top-level helper fields.

The owner confirmed a successful actual sign-in, content import and edited-project preview on 28 October 2026. Automatic publishing still needs connecting; the public website remains in bootstrap mode. No real enquiry provider is connected.

Source and editing instructions: https://github.com/StudioDalo/Website-design/blob/main/EDITOR_SETUP.md
