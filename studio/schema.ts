import { defineField, defineType } from "sanity";
const string = (name: string, title: string, description?: string) =>
  defineField({ name, title, type: "string", description });
const prose = (name: string, title: string) =>
  defineField({ name, title, type: "text", rows: 3 });
const section = (
  name: string,
  title: string,
  fields: ReturnType<typeof defineField>[],
  group: string,
) => defineField({ name, title, type: "object", fields, group });
export const mediaItem = defineType({
  name: "mediaItem",
  title: "Image, drawing or film",
  type: "object",
  fields: [
    defineField({
      name: "type",
      title: "Media type",
      type: "string",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Drawing", value: "drawing" },
          { title: "Short video", value: "video" },
        ],
        layout: "radio",
      },
      initialValue: "image",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.type === "video",
      description:
        "Set the focal point to keep the important part visible when cropped.",
      validation: (r) =>
        r.custom((v, ctx) =>
          (ctx.parent as { type?: string })?.type !== "video" && !v
            ? "Upload an image."
            : true,
        ),
    }),
    defineField({
      name: "video",
      title: "Film",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      hidden: ({ parent }) => parent?.type !== "video",
      description:
        "Use a compressed MP4 or WebM, ideally 6–12 seconds and under 8 MB. The hero is always muted.",
      validation: (r) =>
        r.custom((v, ctx) =>
          (ctx.parent as { type?: string })?.type === "video" && !v
            ? "Upload the film."
            : true,
        ),
    }),
    defineField({
      name: "poster",
      title: "Still image for the film",
      type: "image",
      hidden: ({ parent }) => parent?.type !== "video",
      description:
        "Shown before playback, with reduced motion, and when autoplay is unavailable.",
      validation: (r) =>
        r.custom((v, ctx) =>
          (ctx.parent as { type?: string })?.type === "video" && !v
            ? "Choose a still image."
            : true,
        ),
    }),
    ...["width", "height"].map((name) =>
      defineField({
        name,
        title: `Film ${name} in pixels`,
        type: "number",
        hidden: ({ parent }) => parent?.type !== "video",
        validation: (r) =>
          r
            .min(1)
            .integer()
            .custom((v, ctx) =>
              (ctx.parent as { type?: string })?.type === "video" && !v
                ? "Enter the video dimensions."
                : true,
            ),
      }),
    ),
    defineField({
      ...string(
        "alt",
        "Image description",
        "Describe the space, materials and light for visitors who cannot see the image.",
      ),
      validation: (r) => r.required(),
    }),
    prose("caption", "Caption"),
    defineField({
      ...string(
        "credit",
        "Credit and authorship",
        "Include photographer/creator and your permission. Keep AI-generated images labelled as AI-generated.",
      ),
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "alt", subtitle: "credit", media: "image" } },
});
export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [
    { name: "main", title: "Project", default: true },
    { name: "story", title: "Story & credits" },
    { name: "media", title: "Images" },
    { name: "publishing", title: "Publishing" },
  ],
  initialValue: { approved: false, placeholder: false, featuredOrder: 100 },
  fields: [
    defineField({
      ...string("title", "Project title"),
      group: "main",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Website address",
      type: "slug",
      group: "main",
      options: { source: "title", maxLength: 90 },
      validation: (r) =>
        r
          .required()
          .custom((v) =>
            !v?.current || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v.current)
              ? true
              : "Use lowercase letters, numbers and hyphens.",
          ),
    }),
    defineField({
      ...string("discipline", "Discipline"),
      group: "main",
      options: { list: ["Architecture", "Interiors", "Design"] },
      validation: (r) => r.required(),
    }),
    defineField({
      ...string("sector", "Sector"),
      group: "main",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      group: "main",
      validation: (r) => r.integer().min(1900).max(2200),
    }),
    ...["location", "status"].map((name) =>
      defineField({
        ...string(name, name[0].toUpperCase() + name.slice(1)),
        group: "main",
      }),
    ),
    defineField({
      ...prose("introduction", "Introduction"),
      group: "main",
      validation: (r) => r.required(),
    }),
    ...[
      "overview",
      "challenge",
      "approach",
      "outcome",
      "role",
      "contribution",
      "practice",
    ].map((name) =>
      defineField({
        ...prose(name, name[0].toUpperCase() + name.slice(1)),
        group: "story",
      }),
    ),
    defineField({
      name: "collaborators",
      title: "Collaborators",
      type: "array",
      of: [{ type: "string" }],
      group: "story",
    }),
    defineField({
      name: "hero",
      title: "Project cover",
      type: "mediaItem",
      group: "media",
      validation: (r) =>
        r
          .required()
          .custom((v) =>
            (v as { type?: string })?.type === "video"
              ? "Use a still image for project covers. Films can go in the gallery or homepage hero."
              : true,
          ),
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "mediaItem" }],
      group: "media",
      description:
        "Drag images into the order you want. The cover is included automatically.",
    }),
    defineField({
      name: "featuredOrder",
      title: "Collection order",
      type: "number",
      group: "publishing",
      validation: (r) => r.required().min(0).integer(),
    }),
    defineField({
      name: "tags",
      title: "Search tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "publishing",
    }),
    defineField({
      name: "placeholder",
      title: "Demonstration / fictional project",
      type: "boolean",
      group: "publishing",
      description:
        "Keep enabled for the generated example collection. It must not be presented as completed client work.",
    }),
    defineField({
      name: "approved",
      title: "Approved for the public website",
      type: "boolean",
      group: "publishing",
      description:
        "Confirm the narrative, your role, image credits and public-display permission, then enable this and Publish. Disable and Publish to remove a project from the next website build.",
    }),
  ],
  orderings: [
    {
      title: "Collection order",
      name: "collection",
      by: [{ field: "featuredOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", approved: "approved", media: "hero.image" },
    prepare: ({ title, approved, media }) => ({
      title,
      media,
      subtitle: approved ? "Approved for website" : "Excluded from website",
    }),
  },
});
const homeTitles: Record<string, string> = {
  heroEyebrow: "Opening label",
  heroIntro: "Opening title",
  heroIntroEmphasis: "Opening title emphasis",
  heroStatement: "Revealed scene heading",
  heroStatementEmphasis: "Revealed heading emphasis",
  heroDescription: "Revealed scene description",
  introEyebrow: "Introduction label",
  introTitle: "Introduction heading",
  introEmphasis: "Introduction emphasis",
  collectionTitle: "Collection heading",
  collectionEmphasis: "Collection emphasis",
  collectionDescription: "Collection introduction",
  aboutTitle: "About heading",
  aboutEmphasis: "About emphasis",
  approachTitle: "Approach heading",
  approachEmphasis: "Approach emphasis",
  approachDescription: "Approach introduction",
  contactTitle: "Contact heading",
  contactEmphasis: "Contact emphasis",
  contactDescription: "Contact introduction",
  interludeTitle: "Image interlude heading",
  interludeEmphasis: "Image interlude emphasis",
};
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Website settings",
  type: "document",
  groups: [
    "Identity",
    "Homepage",
    "Hero",
    "About",
    "Approach",
    "Appearance",
  ].map((title, i) => ({ name: title.toLowerCase(), title, default: i === 0 })),
  fields: [
    section(
      "brand",
      "Studio identity",
      [
        string("name", "Studio name"),
        string(
          "wordmark",
          "Hero wordmark",
          "Keep this short so it fits the opening window.",
        ),
        string("designer", "Designer"),
        string("title", "Professional title"),
        prose("description", "Short studio description"),
        defineField({
          ...string("email", "Public contact email"),
          validation: (r) => r.email(),
        }),
        defineField({
          name: "siteUrl",
          title: "Public website address",
          type: "url",
          validation: (r) => r.uri({ scheme: ["https"] }),
        }),
      ],
      "identity",
    ),
    section(
      "home",
      "Homepage text and imagery",
      [
        ...Object.entries(homeTitles).map(([name, title]) =>
          prose(name, title),
        ),
        defineField({
          name: "interludeImage",
          title: "Large image between Work and About",
          type: "mediaItem",
        }),
        defineField({
          name: "aboutImage",
          title: "About image",
          type: "mediaItem",
        }),
      ],
      "homepage",
    ),
    section(
      "hero",
      "Opening scene",
      [
        defineField({
          name: "mode",
          title: "Opening media",
          type: "string",
          initialValue: "images",
          options: {
            list: [
              { title: "Image sequence", value: "images" },
              { title: "Short film", value: "video" },
            ],
            layout: "radio",
          },
        }),
        defineField({
          name: "images",
          title: "Hero images in order",
          type: "array",
          of: [{ type: "mediaItem" }],
          description:
            "Choose up to six still images. Leave empty to use project covers.",
          hidden: ({ parent }) => parent?.mode === "video",
          validation: (r) =>
            r
              .max(6)
              .custom((v) =>
                Array.isArray(v) &&
                v.some((m) => (m as { type?: string })?.type === "video")
                  ? "Use still images here; choose Short film for video."
                  : true,
              ),
        }),
        defineField({
          name: "video",
          title: "Hero film",
          type: "mediaItem",
          hidden: ({ parent }) => parent?.mode !== "video",
          validation: (r) =>
            r.custom((v, ctx) =>
              (ctx.parent as { mode?: string })?.mode === "video" &&
              (v as { type?: string })?.type !== "video"
                ? "Choose video media with a poster image."
                : true,
            ),
        }),
      ],
      "hero",
    ),
    section(
      "profile",
      "About Darlington",
      [
        prose("introduction", "Introduction"),
        prose("body", "Biography"),
        prose("note", "Additional note"),
      ],
      "about",
    ),
    ...["approach", "capabilities"].map((name) =>
      defineField({
        name,
        title: name === "approach" ? "Approach steps" : "Capabilities",
        type: "array",
        group: "approach",
        of: [
          {
            type: "object",
            fields: [string("title", "Title"), prose("body", "Description")],
          },
        ],
      }),
    ),
    section(
      "appearance",
      "Typography",
      [
        defineField({
          name: "bodyFont",
          title: "Text font",
          type: "string",
          options: {
            list: [
              { title: "Manrope — current", value: "manrope" },
              { title: "System sans serif", value: "system" },
              { title: "Georgia serif", value: "georgia" },
            ],
          },
        }),
        defineField({
          name: "headingFont",
          title: "Emphasis font",
          type: "string",
          options: {
            list: [
              { title: "Instrument Serif — current", value: "instrument" },
              { title: "Georgia serif", value: "georgia" },
              { title: "Manrope", value: "manrope" },
            ],
          },
        }),
        defineField({
          name: "textSize",
          title: "Text size",
          type: "string",
          description: "Both presets preserve the minimum readable text size.",
          options: {
            list: [
              {
                title: "Balanced — 16px labels, 18–20px body",
                value: "comfortable",
              },
              {
                title: "Larger — 18px labels, 20–22.5px body",
                value: "larger",
              },
            ],
          },
        }),
      ],
      "appearance",
    ),
  ],
  preview: { prepare: () => ({ title: "Studio Da’lo website settings" }) },
});
