import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Studio brand assets",
  robots: { index: false, follow: true },
  alternates: { canonical: "/brand/" },
};
export default function BrandAssets() {
  return (
    <main id="main" className="information-page">
      <Link href="/">Back to the website</Link>
      <h1>Studio Da’lo brand assets</h1>
      <p>
        The original DA symbol and stacked wordmark, exported from vector
        artwork. PNG backgrounds are transparent. Use light artwork on dark
        backgrounds and dark artwork on light backgrounds.
      </p>
      <div className="brand-downloads">
        {["logo", "symbol"].flatMap((kind) =>
          ["light", "dark"].map((tone) => (
            <section
              key={`${kind}-${tone}`}
              className={`brand-download brand-preview-${tone}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/brand/${kind}-${tone}.svg`}
                alt={`${tone} ${kind === "logo" ? "Studio Da’lo logo" : "DA symbol"}`}
                width={kind === "logo" ? 600 : 160}
                height={160}
              />
              <h2>
                {kind === "logo" ? "Full logo" : "DA symbol"} · {tone}
              </h2>
              <a download href={`/brand/${kind}-${tone}.svg`}>
                Download SVG
              </a>
              <a download href={`/brand/${kind}-${tone}.png`}>
                Download transparent PNG
              </a>
            </section>
          )),
        )}
      </div>
      <p>
        Change the website’s logo through Website settings → Branding in the
        editing dashboard. Header, footer and the About mark use those shared
        settings.
      </p>
    </main>
  );
}
