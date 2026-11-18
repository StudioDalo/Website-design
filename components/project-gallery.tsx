"use client";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Media as MediaType } from "@/lib/types";
import { Dialog } from "./dialog";
import { Media } from "./media";
import { Icon } from "./icons";

export function ProjectGallery({
  items,
  initialIndex,
  onClose,
}: {
  items: MediaType[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [playing, setPlaying] = useState(false);
  const [restricted, setRestricted] = useState(true);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const current = items[index];
  const move = (delta: number) =>
    setIndex((value) => (value + delta + items.length) % items.length);
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & {
        connection?: {
          saveData?: boolean;
          addEventListener?: (type: string, listener: () => void) => void;
          removeEventListener?: (type: string, listener: () => void) => void;
        };
      }
    ).connection;
    const update = () => {
      setRestricted(reduced.matches || !!connection?.saveData);
    };
    update();
    reduced.addEventListener("change", update);
    connection?.addEventListener?.("change", update);
    return () => {
      reduced.removeEventListener("change", update);
      connection?.removeEventListener?.("change", update);
    };
  }, []);
  useEffect(() => {
    if (!playing || restricted || items.length < 2 || current.type === "video")
      return;
    let timer: ReturnType<typeof setTimeout>;
    // Handle visibility synchronously: background timers must not race React rendering.
    const schedule = () => {
      clearTimeout(timer);
      if (!document.hidden)
        timer = setTimeout(() => {
          if (!document.hidden) setIndex((value) => (value + 1) % items.length);
        }, 5000);
    };
    schedule();
    document.addEventListener("visibilitychange", schedule);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [playing, restricted, items.length, index, current.type]);
  useEffect(() => {
    if (restricted) return;
    const next = items[(index + 1) % items.length];
    if (next.type !== "video") {
      const preload = new window.Image();
      preload.src = next.src;
    }
  }, [index, items, restricted]);
  return (
    <Dialog
      onClose={onClose}
      titleId="zoom-title"
      className="zoom-dialog project-gallery-dialog"
      closeLabel="Close enlarged media"
      onKeyDown={(event) => {
        if (event.target instanceof HTMLVideoElement) return;
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          event.stopPropagation();
          setPlaying(false);
          move(event.key === "ArrowRight" ? 1 : -1);
        }
      }}
    >
      <div className="gallery-viewer">
        <div className="gallery-heading">
          <h2 id="zoom-title" className="eyebrow">
            {current.type === "drawing"
              ? "Drawing — uncropped view"
              : current.type === "video"
                ? "Film"
                : "Image — uncropped view"}
          </h2>
          <span
            className="gallery-counter"
            role="status"
            aria-live={playing ? "off" : "polite"}
          >
            {index + 1} / {items.length}
          </span>
        </div>
        <div
          className="gallery-stage"
          style={{ "--gallery-ratio": current.aspectRatio } as CSSProperties}
          onTouchCancel={() => {
            touch.current = null;
          }}
          onTouchStart={(event) => {
            if ((event.target as HTMLElement).closest("video,button")) return;
            touch.current = {
              x: event.touches[0].clientX,
              y: event.touches[0].clientY,
            };
          }}
          onTouchEnd={(event) => {
            if (!touch.current) return;
            const dx = event.changedTouches[0].clientX - touch.current.x;
            const dy = event.changedTouches[0].clientY - touch.current.y;
            touch.current = null;
            if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) {
              setPlaying(false);
              move(dx < 0 ? 1 : -1);
            }
          }}
        >
          <Media
            key={current.src}
            media={current}
            contain
            priority
            sizes="95vw"
          />
        </div>
        <div className="gallery-controls">
          <button
            className="icon-button"
            disabled={items.length < 2}
            aria-label="Previous image"
            onClick={() => {
              setPlaying(false);
              move(-1);
            }}
          >
            <Icon name="left" />
          </button>
          {items.length > 1 && (
            <button
              className="text-button"
              disabled={restricted || current.type === "video"}
              onClick={() => setPlaying(!playing)}
            >
              {playing && !restricted ? "Pause slideshow" : "Play slideshow"}
            </button>
          )}
          <button
            className="icon-button"
            disabled={items.length < 2}
            aria-label="Next image"
            onClick={() => {
              setPlaying(false);
              move(1);
            }}
          >
            <Icon name="right" />
          </button>
        </div>
        <div className="gallery-caption">
          <p>{current.caption || current.alt}</p>
          <p>{current.credit}</p>
        </div>
        {restricted && items.length > 1 && (
          <p className="gallery-preference">
            Automatic playback is off for your motion or data-saving preference.
          </p>
        )}
        <div className="gallery-thumbnails" aria-label="Choose a project image">
          {items.map((media, i) => (
            <button
              key={media.src}
              aria-label={`View ${media.type === "video" ? "film" : "image"} ${i + 1}: ${media.alt}`}
              aria-pressed={i === index}
              onClick={() => {
                setPlaying(false);
                setIndex(i);
              }}
            >
              <Image
                src={media.type === "video" ? media.poster! : media.src}
                alt=""
                width={100}
                height={70}
                sizes="100px"
              />
              {media.type === "video" && <span>Film</span>}
            </button>
          ))}
        </div>
        <a
          href={current.src}
          target="_blank"
          rel="noopener noreferrer"
          className="text-button"
        >
          Open original at full size <Icon />
        </a>
      </div>
    </Dialog>
  );
}
