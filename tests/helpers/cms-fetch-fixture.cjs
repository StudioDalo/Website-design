// Local verification only. Loaded explicitly through NODE_OPTIONS by test:cms.
// It intercepts a synthetic project; ordinary builds never import this file.
const originalFetch = globalThis.fetch;
const image = {
  type: "image",
  src: "https://cdn.sanity.io/images/example/production/test-1600x1000.webp",
  width: 1600,
  height: 1000,
  alt: "CMS test courtyard",
  caption: "Local test image",
  credit: "AI-generated local test fixture",
};
const project = {
  _id: "fixture-courtyard",
  title: "CMS courtyard",
  slug: "cms-courtyard",
  discipline: "Architecture",
  sector: "Residential",
  introduction: "A published project added through the CMS boundary.",
  approved: true,
  placeholder: false,
  featuredOrder: 1,
  hero: image,
  gallery: [
    image,
    {
      ...image,
      type: "video",
      src: "https://cdn.sanity.io/files/example/production/test.mp4",
      poster: image.src,
    },
  ],
  tags: ["stone"],
};
globalThis.fetch = async (input, init) => {
  const url = String(input?.url || input);
  if (url.startsWith("https://example.api.sanity.io/")) {
    return Response.json({
      result: {
        projects: [
          project,
          {
            _id: "drafts.private",
            approved: true,
            title: "PRIVATE_DRAFT_TEST_MARKER",
          },
        ],
        settings: {
          home: { introTitle: "Content controlled from the dashboard" },
          appearance: {
            bodyFont: "georgia",
            headingFont: "manrope",
            textSize: "larger",
          },
          hero: {
            mode: "video",
            video: {
              ...image,
              type: "video",
              src: "https://cdn.sanity.io/files/example/production/test.mp4",
              poster: image.src,
            },
          },
        },
      },
    });
  }
  return originalFetch(input, init);
};
