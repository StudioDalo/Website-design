import { useState } from "react";
import { useClient } from "sanity";
type SeedMedia = {
  src: string;
  type: string;
  alt: string;
  caption: string;
  credit: string;
  width: number;
  height: number;
};
type Seed = {
  projects: Array<
    Record<string, unknown> & {
      id: string;
      hero: SeedMedia;
      gallery: SeedMedia[];
    }
  >;
  settings: Record<string, unknown>;
};
export function Welcome() {
  const client = useClient({ apiVersion: "2025-02-19" });
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function seed() {
    if (!confirmed || busy) return;
    setBusy(true);
    try {
      const response = await fetch("/cms-seed.json");
      if (!response.ok)
        throw new Error("The demonstration collection could not be loaded.");
      const data = (await response.json()) as Seed;
      const uploaded = new Map<string, string>();
      const upload = async (media: SeedMedia) => {
        if (!media.src.startsWith("/media/"))
          throw new Error("Unexpected demonstration asset.");
        let assetId = uploaded.get(media.src);
        if (!assetId) {
          setMessage(`Preparing ${media.src.split("/").pop()}…`);
          const image = await fetch(media.src);
          if (!image.ok) throw new Error("An example image is unavailable.");
          const asset = await client.assets.upload(
            "image",
            await image.blob(),
            { filename: media.src.split("/").pop() },
          );
          assetId = asset._id;
          uploaded.set(media.src, assetId);
        }
        return {
          _type: "mediaItem",
          type: media.type,
          alt: media.alt,
          caption: media.caption,
          credit: media.credit,
          image: {
            _type: "image",
            asset: { _type: "reference", _ref: assetId },
          },
        };
      };
      // Stable IDs plus createIfNotExists preserve subsequent edits and make retries safe.
      const transaction = client.transaction();
      for (const project of data.projects) {
        const { id, slug, hero, gallery, ...rest } = project;
        const images = [];
        for (let i = 0; i < gallery.length; i++)
          images.push({ ...(await upload(gallery[i])), _key: `image-${i}` });
        transaction.createIfNotExists({
          ...rest,
          _id: `demo-${id}`,
          _type: "project",
          slug: { _type: "slug", current: String(slug) },
          hero: await upload(hero),
          gallery: images,
        });
      }
      const settings = { ...data.settings };
      for (const key of ["approach", "capabilities"]) {
        if (Array.isArray(settings[key]))
          settings[key] = settings[key].map(
            (item: Record<string, unknown>, i: number) => ({
              ...item,
              _key: `${key}-${i}`,
              _type: "object",
            }),
          );
      }
      transaction.createIfNotExists({
        ...settings,
        _id: "siteSettings",
        _type: "siteSettings",
      });
      await transaction.commit();
      setMessage(
        "The demonstration collection is ready. Open Projects or Website settings to begin. Existing documents were preserved.",
      );
    } catch {
      setMessage(
        "Import could not finish. Check your Sanity write permission and connection, then retry. Existing documents have been preserved.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div
      style={{
        maxWidth: "900px",
        padding: "40px",
        font: "20px/1.6 Arial,sans-serif",
        margin: "auto",
      }}
    >
      <h1 style={{ fontSize: "40px" }}>Your Studio Da’lo website</h1>
      <p>
        Use Website settings for the homepage, fonts and opening film. Use
        Projects to add and arrange your work.
      </p>
      <ol>
        <li>Make changes. Drafts are saved in your account.</li>
        <li>Use Content preview to check project text and its cover.</li>
        <li>Enable public approval for a project when ready, then Publish.</li>
        <li>
          Once the Netlify webhook is connected, publishing starts a website
          rebuild. Your current website stays available until that build
          succeeds.
        </li>
      </ol>
      <h2 style={{ fontSize: "28px" }}>
        Start with the current demonstration collection
      </h2>
      <p>
        This imports the eight fictional studies and their generated images.
        They remain labelled demonstrations. It does not overwrite existing
        documents.
      </p>
      <label style={{ display: "block", margin: "24px 0" }}>
        <input
          type="checkbox"
          checked={confirmed}
          disabled={busy}
          onChange={(e) => setConfirmed(e.target.checked)}
          style={{ width: "24px", height: "24px", marginRight: "12px" }}
        />
        Import the example projects into my Sanity dataset.
      </label>
      <button
        disabled={!confirmed || busy}
        onClick={seed}
        style={{ padding: "16px 24px", fontSize: "20px", cursor: "pointer" }}
      >
        {busy ? "Importing…" : "Import demonstration collection"}
      </button>
      <p role="status">{message}</p>
      <p>
        Uploaded Sanity asset URLs are accessible to anyone who has the URL.
        Keep confidential client material outside this media library.
      </p>
    </div>
  );
}
