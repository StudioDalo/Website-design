"use client";
import { useLayoutEffect, useRef, type RefObject } from "react";
export function useCollectionMotion(
  container: RefObject<HTMLDivElement | null>,
  signature: string,
  quiet: boolean,
) {
  const positions = useRef(new Map<string, DOMRect>());
  const animations = useRef<Animation[]>([]);
  function capture() {
    for (const animation of animations.current) animation.cancel();
    animations.current = [];
    const map = new Map<string, DOMRect>();
    container.current
      ?.querySelectorAll<HTMLElement>("[data-project-id]")
      .forEach((node) =>
        map.set(node.dataset.projectId!, node.getBoundingClientRect()),
      );
    positions.current = map;
  }
  useLayoutEffect(() => {
    if (quiet || !positions.current.size) return;
    container.current
      ?.querySelectorAll<HTMLElement>("[data-project-id]")
      .forEach((node) => {
        const old = positions.current.get(node.dataset.projectId!);
        const next = node.getBoundingClientRect();
        const frames = old
          ? [
              {
                transform: `translate(${old.left - next.left}px, ${old.top - next.top}px) scale(${old.width / next.width}, ${old.height / next.height})`,
                opacity: 1,
              },
              { transform: "none", opacity: 1 },
            ]
          : [
              { transform: "translateY(12px) scale(.985)", opacity: 0.65 },
              { transform: "none", opacity: 1 },
            ];
        animations.current.push(
          node.animate(frames, {
            duration: old ? 480 : 420,
            easing: "cubic-bezier(.16,1,.3,1)",
          }),
        );
      });
    positions.current.clear();
    return () => {
      for (const animation of animations.current) animation.cancel();
    };
  }, [container, signature, quiet]);
  return capture;
}
