import { useEffect, useState } from "react";
import {
  insert,
  setIfMissing,
  useDocumentStore,
  type ArrayOfObjectsInputProps,
} from "sanity";
import { automaticHeroProjects } from "../lib/hero-projects";

interface ProjectCover {
  _id: string;
  title: string;
  thumbnail: string | null;
}

const publishedProjects = '*[_type == "project" && approved == true]';
const coversQuery = `${publishedProjects}
  | order(coalesce(featuredOrder, 999) asc, _id asc)[0...6]{
    _id, title, "thumbnail": hero.image.asset->url
  }`;

function AutomaticCovers({ onChange, readOnly }: ArrayOfObjectsInputProps) {
  const store = useDocumentStore();
  const [covers, setCovers] = useState<ProjectCover[]>();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const subscription = store
      .listenQuery(
        { fetch: coversQuery, listen: '*[_type == "project"]' },
        {},
        { apiVersion: "2025-02-19", perspective: "published" },
      )
      .subscribe({
        next: (projects: ProjectCover[]) => {
          setFailed(false);
          setCovers(automaticHeroProjects(projects));
        },
        error: () => setFailed(true),
      });
    return () => subscription.unsubscribe();
  }, [store]);

  if (failed)
    return <p role="status">Couldn’t load the automatic project covers.</p>;
  if (!covers) return <p role="status">Loading automatic project covers…</p>;
  if (!covers.length)
    return (
      <p>No approved projects yet. The hero uses the demonstration image.</p>
    );

  function editSequence(selection: ProjectCover[]) {
    const references = selection.map(({ _id }) => ({
      _key: crypto.randomUUID(),
      _type: "reference",
      _weak: true,
      _ref: _id,
    }));
    onChange([setIfMissing([]), insert(references, "after", [-1])]);
  }

  return (
    <div>
      <strong>Automatic project covers</strong>
      <ol>
        {covers.map(({ _id, title, thumbnail }) => (
          <li key={_id} style={{ marginBlock: 6 }}>
            {thumbnail && (
              <img
                src={thumbnail + "?w=112&h=72&fit=crop&auto=format"}
                alt=""
                width={56}
                height={36}
                style={{ verticalAlign: "middle", marginRight: 8 }}
              />
            )}
            {title}
          </li>
        ))}
      </ol>
      <button
        type="button"
        disabled={readOnly}
        onClick={() => editSequence(covers)}
      >
        Edit this sequence
      </button>
    </div>
  );
}

export function HeroSequenceInput(props: ArrayOfObjectsInputProps) {
  return (
    <>
      {!props.value?.length && <AutomaticCovers {...props} />}
      {props.renderDefault(props)}
    </>
  );
}
