import { brand, profile, approach, capabilities } from "./settings";
import type { Media } from "./types";

export const defaultSettings = {
  brand,
  profile,
  approach,
  capabilities,
  appearance: {
    bodyFont: "manrope",
    headingFont: "instrument",
    textSize: "comfortable",
  },
  hero: {
    mode: "images",
    images: [] as Media[],
    video: undefined as Media | undefined,
  },
  home: {
    heroEyebrow: "Studio / Architectural Designer",
    heroIntro: "Space is only",
    heroIntroEmphasis: "the beginning.",
    heroStatement: "Spaces to inhabit.",
    heroStatementEmphasis: "Ideas to live with.",
    heroDescription:
      "Explorations in space, light and the things we live with.",
    introEyebrow: "A practice of looking closer",
    introTitle: "Space. Light. Material.",
    introEmphasis: "The quiet things that change everything.",
    collectionTitle: "A collection of",
    collectionEmphasis: "possibilities.",
    collectionDescription:
      "Move between spaces, objects and ideas. A closer look is always worth taking.",
    aboutTitle: "Thoughtful spaces.",
    aboutEmphasis: "Human stories.",
    approachTitle: "From curiosity",
    approachEmphasis: "to clarity.",
    approachDescription: "The approach evolves with each project.",
    contactTitle: "Good things begin with",
    contactEmphasis: "a conversation.",
    contactDescription:
      "Have a space, an idea, or a question? Let’s find a starting point.",
    interludeTitle: "A little closer",
    interludeEmphasis: "to possibility.",
    interludeImage: undefined as Media | undefined,
    aboutImage: undefined as Media | undefined,
  },
};
export type SiteSettings = typeof defaultSettings;
