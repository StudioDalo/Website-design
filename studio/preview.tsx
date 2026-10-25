import { useClient } from "sanity";
import type { UserViewComponent } from "sanity/structure";
export const ProjectPreview: UserViewComponent = ({ document }) => {
  const client = useClient({ apiVersion: "2025-02-19" });
  const value = document.displayed as Record<string, unknown>;
  const hero = value.hero as
    | { image?: { asset?: { _ref?: string } }; alt?: string }
    | undefined;
  const ref = hero?.image?.asset?._ref;
  const match = ref?.match(/^image-(.+)-(\d+x\d+)-([a-z]+)$/);
  const config = client.config();
  const src = match
    ? `https://cdn.sanity.io/images/${config.projectId}/${config.dataset}/${match[1]}-${match[2]}.${match[3]}?w=1400&auto=format`
    : "";
  return (
    <article
      style={{
        padding: "32px",
        font: "20px/1.6 Arial,sans-serif",
        background: "#f5f2ea",
        color: "#1d3028",
        minHeight: "100%",
      }}
    >
      <p>
        Content preview ·{" "}
        {document.published
          ? "Changes may still be drafts"
          : "Not yet published"}
      </p>
      <p>
        This checks your project content before publishing. The website layout
        and motion are checked on the deployed site.
      </p>
      {src && (
        <img
          src={src}
          alt={hero?.alt || "Project preview"}
          style={{
            width: "100%",
            maxHeight: "55vh",
            objectFit: "contain",
            margin: "24px 0",
          }}
        />
      )}
      <h1 style={{ fontSize: "40px", lineHeight: 1.1 }}>
        {String(value.title || "Untitled project")}
      </h1>
      <p>
        {String(value.discipline || "")} / {String(value.sector || "")}
      </p>
      {[
        "introduction",
        "overview",
        "challenge",
        "approach",
        "outcome",
        "role",
        "contribution",
        "practice",
      ].map((key) =>
        value[key] ? (
          <section key={key}>
            <h2 style={{ fontSize: "26px", textTransform: "capitalize" }}>
              {key}
            </h2>
            <p style={{ whiteSpace: "pre-line" }}>{String(value[key])}</p>
          </section>
        ) : null,
      )}
    </article>
  );
};
