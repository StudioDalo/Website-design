"use client";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
} from "react";
import type { Project } from "@/lib/types";
import { disciplines, filterProjects, neighbors } from "@/lib/catalog";
import { useSite } from "./site-provider";
import { Media } from "./media";
import { Icon, Mark } from "./icons";
import { Dialog } from "./dialog";
import { ProjectStory } from "./project-story";
import { Contact } from "./contact";
import { CinematicHero } from "./cinematic-hero";
import { useQuietMotion } from "./motion-preference";
import { useCollectionMotion } from "./collection-motion";
function subscribeView(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("dalo-view", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("dalo-view", callback);
  };
}
function subscribeLocation(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}
function getProjectReference() {
  return new URLSearchParams(window.location.search).get("project") || "";
}
function getView(): "wall" | "index" {
  try {
    const value = JSON.parse(localStorage.getItem("dalo-view") || '"wall"');
    return value === "index" ? "index" : "wall";
  } catch {
    return "wall";
  }
}
export function Portfolio({
  projects,
  initialReference = "",
}: {
  projects: Project[];
  initialReference?: string;
}) {
  const { brand, profile, approach, capabilities, home } = useSite();
  const hasDemonstrations = projects.some((p) => p.placeholder);
  const interlude =
    home.interludeImage ?? projects[5]?.hero ?? projects[0]?.hero;
  const aboutImage = home.aboutImage ?? projects[3]?.hero ?? projects[0]?.hero;
  const collection = useRef<HTMLDivElement>(null);
  const quiet = useQuietMotion();
  const [discipline, setDiscipline] = useState("All");
  const [query, setQuery] = useState("");
  const view = useSyncExternalStore(
    subscribeView,
    getView,
    () => "wall" as const,
  );
  const [temporaryView, setTemporaryView] = useState<"wall" | "index" | null>(
    null,
  );
  const actualView = temporaryView || view;
  const [motion, setMotion] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const urlReference = useSyncExternalStore(
    subscribeLocation,
    getProjectReference,
    () => "",
  );
  const [reference, setReference] = useState<string | null>(
    initialReference || null,
  );
  const pendingDiscuss = useRef(false);
  const dialogContent = useRef<HTMLDivElement>(null);
  const results = filterProjects(projects, discipline, query);
  const captureCollection = useCollectionMotion(
    collection,
    `${actualView}:${discipline}:${query}`,
    quiet,
  );
  const adjacent = selected
    ? neighbors(results, selected.slug)
    : { previous: null, next: null };
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const project = projects.find((p) => p.slug === e.state?.daloProject);
      setSelected(project || null);
      if (!project && pendingDiscuss.current) {
        pendingDiscuss.current = false;
        requestAnimationFrame(() => {
          document.getElementById("contact")?.scrollIntoView();
          document
            .getElementById("contact-title")
            ?.focus({ preventScroll: true });
        });
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [projects]);
  useEffect(() => {
    document.title = selected
      ? `${selected.title} — ${brand.name}`
      : `${brand.name} — Architecture, Interiors & Design`;
    if (selected) {
      dialogContent.current?.closest("dialog")?.scrollTo({ top: 0 });
      document.getElementById("project-title")?.focus({ preventScroll: true });
    }
  }, [selected, brand.name]);
  function setView(value: "wall" | "index") {
    captureCollection();
    try {
      localStorage.setItem("dalo-view", JSON.stringify(value));
      window.dispatchEvent(new Event("dalo-view"));
      setTemporaryView(null);
    } catch {
      setTemporaryView(value);
    }
  }
  function open(event: MouseEvent<HTMLAnchorElement>, project: Project) {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return;
    event.preventDefault();
    window.history.pushState(
      { ...window.history.state, daloProject: project.slug },
      "",
      `/work/${project.slug}`,
    );
    setSelected(project);
  }
  function navigate(project: Project) {
    history.replaceState(
      { ...history.state, daloProject: project.slug },
      "",
      `/work/${project.slug}`,
    );
    setSelected(project);
  }
  function reset() {
    captureCollection();
    setQuery("");
    setDiscipline("All");
  }
  return (
    <>
      <CinematicHero projects={projects} />
      <section className="collection-intro">
        <span className="eyebrow">{home.introEyebrow}</span>
        <p>
          {home.introTitle}
          <br />
          <em>{home.introEmphasis}</em>
        </p>
        <div>
          <span>{brand.description}</span>
          <span>A portfolio taking shape.</span>
        </div>
      </section>
      <section
        id="work"
        className="work-section section-anchor"
        aria-labelledby="work-title"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow section-index">01 / The collection</span>
            <h2 id="work-title">
              {home.collectionTitle}
              <br />
              <em>{home.collectionEmphasis}</em>
              <sup>({projects.length.toString().padStart(2, "0")})</sup>
            </h2>
          </div>
          <p>{home.collectionDescription}</p>
        </div>
        {hasDemonstrations && (
          <div className="demo-banner">
            <span className="status-dot" />
            <p>
              Portfolio in progress. These are labelled demonstration slots,
              ready for Darlington’s approved work.
            </p>
            <a href="#about">
              Meet the studio <Icon />
            </a>
          </div>
        )}
        <div className="work-toolbar">
          <div
            className="filters"
            role="group"
            aria-label="Filter by discipline"
          >
            {["All", ...disciplines(projects)].map((category) => (
              <button
                key={category}
                className={discipline === category ? "active" : ""}
                aria-pressed={discipline === category}
                onClick={() => {
                  captureCollection();
                  setDiscipline(category);
                }}
              >
                {category}
                <sup>
                  {(category === "All"
                    ? projects.length
                    : projects.filter((p) => p.discipline === category).length
                  )
                    .toString()
                    .padStart(2, "0")}
                </sup>
              </button>
            ))}
          </div>
          <label className="search">
            <Icon name="search" />
            <span className="sr-only">Search projects</span>
            <input
              type="search"
              placeholder="Search projects"
              value={query}
              onChange={(e) => {
                captureCollection();
                setQuery(e.target.value);
              }}
              maxLength={120}
            />
          </label>
        </div>
        <div className="work-controls">
          <span className="result-count" role="status" aria-live="polite">
            {results.length.toString().padStart(2, "0")}{" "}
            {results.length === 1 ? "project" : "projects"}
            {(query || discipline !== "All") && (
              <button className="reset-inline" onClick={reset}>
                Reset <Icon name="close" />
              </button>
            )}
          </span>
          <div className="view-controls">
            <label className="motion-control">
              <input
                type="checkbox"
                checked={motion}
                onChange={(e) => setMotion(e.target.checked)}
              />
              <span className="switch" />
              <span>Motion previews</span>
              <small>Still-image movement</small>
            </label>
            <div
              className="view-switch"
              role="group"
              aria-label="Collection view"
            >
              <button
                aria-label="Wall view"
                aria-pressed={actualView === "wall"}
                onClick={() => setView("wall")}
              >
                <Icon name="wall" />
                <span>Wall</span>
              </button>
              <button
                aria-label="Index view"
                aria-pressed={actualView === "index"}
                onClick={() => setView("index")}
              >
                <Icon name="index" />
                <span>Index</span>
              </button>
            </div>
          </div>
        </div>
        <div className="collection-surface" ref={collection}>
          {!results.length ? (
            <div className="empty-state">
              <span className="eyebrow">A blank canvas</span>
              <h3>No projects found.</h3>
              <p>Try another title, material, sector or discipline.</p>
              <button className="button button-dark" onClick={reset}>
                Reset the collection <Icon name="right" />
              </button>
            </div>
          ) : actualView === "wall" ? (
            <div className="work-grid">
              {results.map((p, i) => (
                <Link
                  className="project-card"
                  data-project-id={p.id}
                  href={`/work/${p.slug}`}
                  key={p.id}
                  onClick={(e) => open(e, p)}
                >
                  <div className="card-image">
                    <Media
                      media={p.hero}
                      motion={motion && !selected}
                      sizes="(max-width: 359px) 90vw, (max-width: 1024px) 44vw, (max-width: 1399px) 30vw, 22vw"
                    />
                    <span className="card-number">
                      {p.featuredOrder.toString().padStart(2, "0")}
                    </span>
                    <span className="card-open" aria-hidden="true">
                      <Icon />
                    </span>
                    <span className="card-demo">
                      {p.hero.credit.includes("AI-generated")
                        ? "AI-generated study"
                        : p.placeholder
                          ? "Demonstration study"
                          : p.hero.credit}
                    </span>
                  </div>
                  <div className="card-caption">
                    <h3>
                      {p.placeholder
                        ? p.title.replace(/ — Placeholder \d+$/, "")
                        : p.title}
                    </h3>
                    <Icon />
                    <p>
                      {p.discipline}
                      <span>/</span>
                      {p.sector}
                      {p.year && <span>{p.year}</span>}
                    </p>
                  </div>
                  <span className="sr-only">
                    {p.placeholder
                      ? `Demonstration imagery — replace with ${brand.name} work.`
                      : "View project."}
                    Project {i + 1} of {results.length}.
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="index-view">
              <div className="index-header" aria-hidden="true">
                <span>Project</span>
                <span>Discipline</span>
                <span>Sector</span>
                <span>Year</span>
              </div>
              {results.map((p) => (
                <Link
                  className="index-row"
                  data-project-id={p.id}
                  href={`/work/${p.slug}`}
                  key={p.id}
                  onClick={(e) => open(e, p)}
                >
                  <span className="index-project">
                    <small>{p.featuredOrder.toString().padStart(2, "0")}</small>
                    <Media media={p.hero} sizes="90px" />
                    <span>
                      <strong>
                        {p.placeholder
                          ? p.title.replace(/ — Placeholder \d+$/, "")
                          : p.title}
                      </strong>
                      <small>
                        {p.placeholder
                          ? "Demonstration slot"
                          : p.status || "Project study"}
                      </small>
                      <small className="index-mobile-meta">
                        {p.discipline} / {p.sector}
                        {p.year ? ` / ${p.year}` : ""}
                      </small>
                    </span>
                  </span>
                  <span>{p.discipline}</span>
                  <span>{p.sector}</span>
                  <span>
                    {p.year || "—"}
                    <Icon />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
        <p className="work-footnote">
          <span>
            {hasDemonstrations
              ? "Generated mood studies & illustrative drawings. Demonstration projects are labelled."
              : "A selection of spaces, materials and ideas."}
          </span>
          <span>
            Space for what comes next. <Icon name="plus" />
          </span>
        </p>
      </section>
      {interlude && (
        <section
          className="material-interlude"
          aria-label="A study in light and material"
        >
          <Media media={interlude} sizes="100vw" />
          <div>
            <span className="eyebrow">
              {hasDemonstrations
                ? "An exploration, not a commission"
                : "A study in light and material"}
            </span>
            <p>
              {home.interludeTitle}
              <br />
              <em>{home.interludeEmphasis}</em>
            </p>
            <span>
              {interlude.credit.includes("AI-generated")
                ? "AI-generated demonstration imagery"
                : interlude.credit}
            </span>
          </div>
        </section>
      )}
      <section
        id="about"
        className="about-section section-anchor"
        aria-labelledby="about-title"
      >
        <div className="about-art">
          {aboutImage && <Media media={aboutImage} />}
          <div className="about-art-caption">
            <span>Form, material, possibility.</span>
            <span>
              {aboutImage?.credit.includes("AI-generated")
                ? "AI-generated demonstration image"
                : aboutImage?.credit}
            </span>
          </div>
          <Mark className="about-mark" />
        </div>
        <div className="about-copy">
          <span className="eyebrow section-index">02 / A point of view</span>
          <h2 id="about-title">
            {home.aboutTitle}
            <br />
            <em>{home.aboutEmphasis}</em>
          </h2>
          <p className="about-lead">{profile.introduction}</p>
          <p>{profile.body}</p>
          <div className="designer-line">
            <span className="designer-monogram">D.</span>
            <div>
              <strong>{brand.designer}</strong>
              <span>{brand.title}</span>
            </div>
          </div>
          <p className="profile-note">{profile.note}</p>
        </div>
      </section>
      <section
        id="approach"
        className="approach-section section-anchor"
        aria-labelledby="approach-title"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow section-index">
              03 / The way of working
            </span>
            <h2 id="approach-title">
              {home.approachTitle}
              <br />
              <em>{home.approachEmphasis}</em>
            </h2>
          </div>
          <p>{home.approachDescription}</p>
        </div>
        <div className="approach-grid">
          {approach.map((item) => (
            <article key={item.number}>
              <span className="approach-number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
        <div className="capabilities">
          <span className="eyebrow">A wider field of design</span>
          {capabilities.map((item) => (
            <div key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <Icon />
            </div>
          ))}
        </div>
      </section>
      <Contact
        reference={reference ?? urlReference}
        onClearReference={() => setReference("")}
        projects={projects}
      />
      {selected && (
        <Dialog
          titleId="project-title"
          onClose={() => history.back()}
          className="project-dialog"
        >
          <div ref={dialogContent}>
            <ProjectStory
              key={selected.slug}
              project={selected}
              {...adjacent}
              compact
              onNavigate={navigate}
              onDiscuss={(p) => {
                setReference(p.slug);
                pendingDiscuss.current = true;
                history.back();
              }}
            />
          </div>
        </Dialog>
      )}
    </>
  );
}
