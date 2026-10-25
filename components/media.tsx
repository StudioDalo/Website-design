"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Media as MediaType } from "@/lib/types";
import { Icon } from "./icons";
export function Media({
  media,
  priority = false,
  motion = false,
  className = "",
  contain = false,
  decorativeVideo = false,
  onReady,
  sizes = "(max-width: 767px) 100vw, 90vw",
}: {
  media: MediaType;
  priority?: boolean;
  motion?: boolean;
  className?: string;
  contain?: boolean;
  decorativeVideo?: boolean;
  sizes?: string;
  onReady?: () => void;
}) {
  const [failedSource, setFailedSource] = useState("");
  const failed = failedSource === media.src;
  const [moving, setMoving] = useState(false);
  const element = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const node = element.current;
    if (!node) return;
    let visible = false;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & {
        connection?: {
          saveData: boolean;
          addEventListener?: (type: string, listener: () => void) => void;
          removeEventListener?: (type: string, listener: () => void) => void;
        };
      }
    ).connection;
    const update = () => {
      const active =
        motion &&
        visible &&
        !document.hidden &&
        !reduced.matches &&
        !connection?.saveData;
      setMoving(active);
      if (video.current) {
        if (active)
          video.current.play().catch(() => {
            /* Poster remains readable if autoplay is unavailable. */
          });
        else video.current.pause();
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        update();
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    document.addEventListener("visibilitychange", update);
    reduced.addEventListener("change", update);
    connection?.addEventListener?.("change", update);
    update();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      reduced.removeEventListener("change", update);
      connection?.removeEventListener?.("change", update);
    };
  }, [motion]);
  useEffect(() => {
    const clip = video.current;
    if (!clip || !decorativeVideo) return;
    if (moving) {
      clip.load();
      clip.play().catch(() => {
        /* The poster remains when autoplay is rejected. */
      });
    } else clip.pause();
  }, [moving, decorativeVideo, media.src]);
  return (
    <div
      ref={element}
      className={`media ${className} ${moving ? "is-moving" : ""} ${contain ? "media-contain" : ""}`}
      style={
        {
          aspectRatio: media.aspectRatio,
          ...(media.focalX !== undefined
            ? {
                "--media-position": `${media.focalX * 100}% ${(media.focalY ?? 0.5) * 100}%`,
              }
            : {}),
        } as React.CSSProperties
      }
    >
      {failed ? (
        <div
          className="media-fallback"
          role="img"
          aria-label={`${media.alt}. Media unavailable.`}
        >
          <Icon name="plus" />
          <span>Image unavailable</span>
          <small>{media.alt}</small>
        </div>
      ) : media.type === "video" ? (
        <video
          ref={video}
          muted
          loop
          playsInline
          preload="none"
          poster={media.poster}
          aria-label={media.alt}
          controls={!motion && !decorativeVideo}
          onError={() => setFailedSource(media.src)}
        >
          {(!decorativeVideo || moving) && <source src={media.src} />}
        </video>
      ) : (
        <Image
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          priority={priority}
          sizes={sizes}
          onLoad={onReady}
          onError={() => setFailedSource(media.src)}
        />
      )}
    </div>
  );
}
