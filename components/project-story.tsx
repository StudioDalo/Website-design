"use client";
import Link from "next/link";
import { useSite } from "./site-provider";
import { useState } from "react";
import type { Project, Media as MediaType } from "@/lib/types";
import { Media } from "./media";
import { Icon } from "./icons";
import { Dialog } from "./dialog";
export function ProjectStory({
  project,
  previous,
  next,
  onNavigate,
  onDiscuss,
  compact = false,
}: {
  project: Project;
  previous: Project | null;
  next: Project | null;
  onNavigate?: (p: Project) => void;
  onDiscuss?: (p: Project) => void;
  compact?: boolean;
}) {
  const { brand } = useSite();
  const displayTitle = project.placeholder
    ? project.title.replace(/ — Placeholder \d+$/, "")
    : project.title;
  const slot = project.placeholder
    ? project.title.match(/Placeholder \d+$/)?.[0]
    : undefined;
  const [zoom, setZoom] = useState<MediaType | null>(null);
  const [shareFeedback, setShareFeedback] = useState("");
  async function share() {
    const url = `${window.location.origin}/work/${project.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${project.title} — ${brand.name}`,
          url,
        });
        setShareFeedback("Shared.");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setShareFeedback("Project link copied.");
      } else
        setShareFeedback(
          "Copy is unavailable. Use the project URL in your address bar.",
        );
    } catch (error) {
      setShareFeedback(
        error instanceof DOMException && error.name === "AbortError"
          ? "Sharing cancelled."
          : "Could not share. Copy the project URL from your address bar.",
      );
    }
  }
  const neighbor = (p: Project | null, direction: "previous" | "next") =>
    p && (
      <Link
        href={`/work/${p.slug}`}
        className={`project-neighbor ${direction}`}
        onClick={(e) => {
          if (
            onNavigate &&
            !e.metaKey &&
            !e.ctrlKey &&
            !e.shiftKey &&
            e.button === 0
          ) {
            e.preventDefault();
            setShareFeedback("");
            onNavigate(p);
          }
        }}
      >
        <span className="eyebrow">
          {direction === "previous" ? (
            <>
              <Icon name="left" /> Previous project
            </>
          ) : (
            <>
              Next project <Icon name="right" />
            </>
          )}
        </span>
        <span>{p.title}</span>
      </Link>
    );
  return (
    <article className={`project-story ${compact ? "compact" : ""}`}>
      <div className="story-opening">
        <div className="story-intro">
          <div className="eyebrow">
            <span>{project.discipline}</span>
            <span className="tiny-dot" />
            {project.sector}
          </div>
          <span className="story-slot">
            {slot ? `Demonstration / ${slot}` : project.status}
          </span>
          <h1 id="project-title" tabIndex={-1} aria-label={project.title}>
            {displayTitle}
          </h1>
          <p className="story-lead">{project.introduction}</p>
          <div className="story-meta">
            <span>
              {project.placeholder
                ? "Demonstration slot"
                : project.status || "Project study"}
            </span>
            {project.year && <span>{project.year}</span>}
            {project.location && <span>{project.location}</span>}
            <button className="text-button" onClick={share}>
              Share project <Icon name="share" />
            </button>
          </div>
          <dl className="story-facts">
            <div>
              <dt>Field</dt>
              <dd>{project.discipline}</dd>
            </div>
            <div>
              <dt>Sector</dt>
              <dd>{project.sector}</dd>
            </div>
            {project.year && (
              <div>
                <dt>Year</dt>
                <dd>{project.year}</dd>
              </div>
            )}
            {(project.role || project.placeholder) && (
              <div>
                <dt>Role</dt>
                <dd>{project.role || "Add confirmed role"}</dd>
              </div>
            )}
            {(project.practice || project.placeholder) && (
              <div>
                <dt>Practice</dt>
                <dd>{project.practice || "Add confirmed context"}</dd>
              </div>
            )}
          </dl>
          <Link
            className="story-enquiry text-button"
            href={`/?project=${encodeURIComponent(project.slug)}#contact`}
            onClick={(e) => {
              if (onDiscuss) {
                e.preventDefault();
                onDiscuss(project);
              }
            }}
          >
            Start a conversation <Icon />
          </Link>
          <p role="status" className="share-feedback">
            {shareFeedback}
          </p>
        </div>
        <figure className="story-hero">
          <button
            className="hero-enlarge-button"
            aria-label={`Enlarge image: ${project.hero.alt}`}
            onClick={() => setZoom(project.hero)}
          >
            <Media
              key={project.hero.src}
              media={project.hero}
              priority
              sizes="(max-width: 767px) 100vw, 55vw"
            />
            <span className="enlarge-label">
              <Icon name="expand" />
              Explore image
            </span>
          </button>
          <figcaption>{project.hero.caption}</figcaption>
        </figure>
      </div>
      <div className="story-content">
        <aside className="project-credits">
          <span className="eyebrow">Role & attribution</span>
          <dl>
            {(project.role || project.placeholder) && (
              <>
                <dt>Role</dt>
                <dd>{project.role || "Add confirmed role"}</dd>
              </>
            )}
            {(project.practice || project.placeholder) && (
              <>
                <dt>Undertaken while at</dt>
                <dd>
                  {project.practice || "Add practice / independent context"}
                </dd>
              </>
            )}
            {(project.contribution || project.placeholder) && (
              <>
                <dt>Contribution</dt>
                <dd>
                  {project.contribution ||
                    "Add confirmed scope of contribution"}
                </dd>
              </>
            )}
            {project.collaborators?.length ? (
              <>
                <dt>Collaborators</dt>
                <dd>{project.collaborators.join(", ")}</dd>
              </>
            ) : null}
            <dt>Images</dt>
            <dd>{project.hero.credit}</dd>
          </dl>
          {project.placeholder && (
            <p className="credits-note">
              Template for completion. No project authorship, employment or
              commission is claimed.
            </p>
          )}
        </aside>
        <div className="story-prose">
          {[
            ["The overview", project.overview],
            ["The challenge", project.challenge],
            ["The approach", project.approach],
            ["The outcome", project.outcome],
          ].map(
            ([heading, body]) =>
              body && (
                <section key={heading}>
                  <h2>{heading}</h2>
                  <p>{body}</p>
                </section>
              ),
          )}
        </div>
      </div>
      <div className="story-gallery">
        {project.gallery.slice(1).map((media, i) => (
          <figure
            key={`${media.src}-${i}`}
            className={media.type === "drawing" ? "drawing-figure" : ""}
          >
            {media.type === "video" ? (
              <Media media={media} contain />
            ) : (
              <button
                className="enlarge-button"
                aria-label={`Enlarge ${media.type === "drawing" ? "drawing" : "image"}: ${media.alt}`}
                onClick={() => setZoom(media)}
              >
                <Media media={media} contain />
                <span className="enlarge-label">
                  <Icon name="expand" />
                  {media.type === "drawing" ? "View drawing" : "View image"}
                </span>
              </button>
            )}
            <figcaption>
              {media.caption}
              <span>{media.credit}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="story-conversation">
        <span className="eyebrow">A starting point for a conversation</span>
        <h2>Something in mind?</h2>
        <Link
          className="button button-dark"
          href={`/?project=${encodeURIComponent(project.slug)}#contact`}
          onClick={(e) => {
            if (onDiscuss) {
              e.preventDefault();
              onDiscuss(project);
            }
          }}
        >
          Discuss a similar project <Icon />
        </Link>
        <p>
          {project.placeholder
            ? "This reference is a demonstration slot, not a completed project."
            : "Include this project as a reference in your enquiry."}
        </p>
      </div>
      <nav className="project-pagination" aria-label="Project navigation">
        {neighbor(previous, "previous")}
        {neighbor(next, "next")}
      </nav>
      {zoom && (
        <Dialog
          onClose={() => setZoom(null)}
          titleId="zoom-title"
          className="zoom-dialog"
          closeLabel="Close enlarged media"
        >
          <h2 id="zoom-title" className="eyebrow">
            {zoom.type === "drawing"
              ? "Drawing — uncropped view"
              : "Image — uncropped view"}
          </h2>
          <div className="zoom-scroll">
            <Media media={zoom} contain />
          </div>
          <p>{zoom.caption}</p>
          <a
            href={zoom.src}
            target="_blank"
            rel="noreferrer"
            className="text-button"
          >
            Open original at full size <Icon />
          </a>
        </Dialog>
      )}
    </article>
  );
}
