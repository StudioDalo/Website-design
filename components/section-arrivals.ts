"use client";
import { useEffect } from "react";
import { useQuietMotion } from "./motion-preference";

/** Content is visible by default; entrance movement is progressive enhancement. */
export function useSectionArrivals() {
  const quiet = useQuietMotion();
  useEffect(() => {
    if (quiet || typeof IntersectionObserver === "undefined") return;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          if (entry.boundingClientRect.top < 80) continue;
          animations.push(
            entry.target.animate(
              [{ transform: "translateY(12px)" }, { transform: "none" }],
              { duration: 520, easing: "cubic-bezier(.16,1,.3,1)" },
            ),
          );
        }
      },
      { threshold: 0.12 },
    );
    document
      .querySelectorAll("[data-arrival]")
      .forEach((node) => observer.observe(node));
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, [quiet]);
}
