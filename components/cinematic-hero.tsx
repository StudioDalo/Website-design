"use client";
import { useEffect, useId, useRef, useState } from "react";
import type { Project, Media as MediaType } from "@/lib/types";
import { useSite } from "./site-provider";
import { Media } from "./media";
import { Icon } from "./icons";
import { useQuietMotion } from "./motion-preference";

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => v * v * (3 - 2 * v);

/** Native scrolling drives an original wordmark-to-scene aperture; no scroll hijacking. */
export function CinematicHero({ projects }: { projects: Project[] }) {
  const { brand, hero, home } = useSite();
  const root = useRef<HTMLElement>(null);
  const opening = useRef<SVGCircleElement>(null);
  const word = useRef<SVGTextElement>(null);
  const quiet = useQuietMotion();
  const [paused, setPaused] = useState(false);
  const [scene, setScene] = useState(0);
  const [loadedCount, setLoadedCount] = useState(1);
  const maskId = useId().replaceAll(":", "");
  const selected = [projects[0], projects[1], projects[5]].filter(Boolean);
  const fallback: MediaType = {
    src: "/media/courtyard-render.webp",
    type: "image",
    width: 1672,
    height: 940,
    aspectRatio: 1672 / 940,
    alt: "Fictional courtyard mood study in earthy materials and light",
    caption: "AI-generated demonstration imagery",
    credit: "AI-generated demonstration imagery · Not a completed project",
  };
  const stills = hero.images.length
    ? hero.images
    : selected.length
      ? selected.map((p) => p.hero)
      : [fallback];
  const videoMode = hero.mode === "video" && !!hero.video;
  const scenes = videoMode ? [hero.video!] : stills;
  const activeMedia = scenes[scene % scenes.length];

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    let frame = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let visible = true;
    let progress = 0;
    section.dataset.enhanced = "true";
    section.dataset.static = String(quiet);

    const schedule = () => {
      clearTimeout(timer);
      if (
        !videoMode &&
        scenes.length > 1 &&
        !paused &&
        !quiet &&
        visible &&
        !document.hidden &&
        progress < 0.58
      ) {
        timer = setTimeout(() => {
          setScene((index) => (index + 1) % scenes.length);
          schedule();
        }, 5200);
      }
      section.dataset.playing = String(
        !paused && !quiet && visible && !document.hidden && progress < 0.58,
      );
    };
    const render = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const stage = section.querySelector<HTMLElement>(".cinema-stage");
      if (!stage) return;
      progress = quiet
        ? 0
        : clamp(
            -rect.top / Math.max(1, section.offsetHeight - stage.offsetHeight),
          );
      const aperture = ease(clamp((progress - 0.04) / 0.69));
      const radius =
        Math.hypot(stage.clientWidth, stage.clientHeight) * 0.58 * aperture;
      opening.current?.setAttribute("r", radius.toFixed(2));
      if (word.current) {
        word.current.style.transform = `scale(${1 + aperture * 0.65})`;
        word.current.style.opacity = String(
          1 - ease(clamp((progress - 0.35) / 0.25)),
        );
      }
      section.style.setProperty("--hero-progress", String(progress));
      section.style.setProperty(
        "--hero-caption",
        String(ease(clamp((progress - 0.54) / 0.22))),
      );
      section.style.setProperty(
        "--hero-intro",
        String(1 - ease(clamp(progress / 0.22))),
      );
      section.dataset.phase =
        progress < 0.08 ? "wordmark" : progress < 0.72 ? "opening" : "scene";
      document.documentElement.dataset.heroTone =
        rect.bottom > stage.offsetHeight * 0.2 &&
        rect.top < 50 &&
        progress > 0.33
          ? "dark"
          : "light";
      schedule();
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        schedule();
      },
      { threshold: 0.01 },
    );
    observer.observe(section);
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    document.addEventListener("visibilitychange", schedule);
    render();
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      document.removeEventListener("visibilitychange", schedule);
      delete document.documentElement.dataset.heroTone;
    };
  }, [paused, quiet, scenes.length, videoMode]);

  return (
    <section
      ref={root}
      className="cinema-hero"
      aria-labelledby="hero-title"
      data-static={quiet}
    >
      <div className="cinema-stage">
        <div className="cinema-reel" aria-hidden="true">
          {scenes.map((media, index) => (
            <div
              key={media.src + index}
              className={`cinema-slide ${scene % scenes.length === index ? "is-current" : ""}`}
            >
              {(index < loadedCount || index === scene) && (
                <Media
                  media={
                    videoMode && quiet
                      ? { ...media, type: "image", src: media.poster! }
                      : media
                  }
                  decorativeVideo={videoMode}
                  motion={videoMode && !quiet && !paused}
                  priority={index === 0}
                  sizes="100vw"
                  onReady={() => {
                    if (!quiet)
                      setLoadedCount((count) =>
                        Math.max(count, Math.min(scenes.length, index + 2)),
                      );
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="cinema-scrim" />
        <h1 id="hero-title" className="cinema-wordmark">
          <span className="sr-only">{brand.name}.</span>
          <span className="cinema-studio-label" aria-hidden="true">
            STUDIO
          </span>
          <svg
            className="cinema-window"
            width="100%"
            height="100%"
            aria-hidden="true"
          >
            <defs>
              <mask
                id={`aperture-${maskId}`}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="100%"
                height="100%"
              >
                <rect width="100%" height="100%" fill="white" />
                <text
                  ref={word}
                  className="aperture-text"
                  x="50%"
                  y="58%"
                  textAnchor="middle"
                  fill="black"
                >
                  {brand.wordmark.toUpperCase()}
                </text>
                <circle ref={opening} cx="50%" cy="50%" r="0" fill="black" />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              className="cinema-paper"
              mask={`url(#aperture-${maskId})`}
            />
          </svg>
        </h1>
        <div className="cinema-identity">
          <span className="eyebrow">{home.heroEyebrow}</span>
          <p>
            {home.heroIntro}
            <br />
            <em>{home.heroIntroEmphasis}</em>
          </p>
        </div>
        <div className="cinema-byline">
          <span>Architecture.</span>
          <span>Interiors.</span>
          <span>A wider field of design.</span>
        </div>
        <div className="cinema-statement">
          <span className="eyebrow">
            An independent perspective / Darlington
          </span>
          <h2>
            {home.heroStatement}
            <br />
            <em>{home.heroStatementEmphasis}</em>
          </h2>
          <p>{home.heroDescription}</p>
        </div>
        <div className="cinema-bottom">
          <div className="cinema-count">
            <span className="status-dot" />
            {projects.length.toString().padStart(2, "0")} studies
            <span className="cinema-scroll-hint">
              Scroll to look inside <span />
            </span>
          </div>
          <a className="hero-action" href="#work">
            <span>View selected work</span>
            <span className="round-arrow">
              <Icon name="down" />
            </span>
          </a>
        </div>
        <div className="reel-controls">
          <span>
            {videoMode
              ? "Short film"
              : `Visual study ${String((scene % scenes.length) + 1).padStart(2, "0")} / ${String(scenes.length).padStart(2, "0")}`}
          </span>
          {!quiet && (
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-label={
                videoMode
                  ? paused
                    ? "Play hero video"
                    : "Pause hero video"
                  : paused
                    ? "Play image reel"
                    : "Pause image reel"
              }
              aria-pressed={paused}
            >
              {paused ? "Play" : "Pause"}{" "}
              <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
            </button>
          )}
          {!videoMode && scenes.length > 1 && (
            <button
              type="button"
              aria-label="Next hero image"
              onClick={() => setScene((index) => (index + 1) % scenes.length)}
            >
              <Icon name="right" />
            </button>
          )}
        </div>
        <span className="cinema-disclosure">
          {activeMedia.credit.includes("AI-generated")
            ? "AI-generated demonstration imagery · Not a completed project"
            : activeMedia.caption || activeMedia.credit}
        </span>
      </div>
    </section>
  );
}
