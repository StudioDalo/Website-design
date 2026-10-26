"use client";
import { useEffect, useRef, type ReactNode, type KeyboardEvent } from "react";
import { Icon } from "./icons";
export function Dialog({
  children,
  titleId,
  onClose,
  className = "",
  closeLabel = "Close project",
  restoreFocusTo,
}: {
  children: ReactNode;
  titleId: string;
  onClose: () => void;
  className?: string;
  closeLabel?: string;
  restoreFocusTo?: HTMLElement | null;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closingAnimation = useRef<Animation | null>(null);
  const closing = useRef(false);
  useEffect(() => {
    const dialog = ref.current;
    const previous =
      restoreFocusTo || (document.activeElement as HTMLElement | null);
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    // Native modal inertness is reinforced explicitly for assistive tooling.
    // A nested enlargement only inerts siblings within the parent dialog.
    const inerted: HTMLElement[] = [];
    let branch: HTMLElement | null = dialog;
    while (
      branch?.parentElement &&
      branch.parentElement !== document.documentElement
    ) {
      const parent: HTMLElement = branch.parentElement;
      for (const sibling of Array.from(parent.children)) {
        if (
          sibling !== branch &&
          sibling instanceof HTMLElement &&
          !sibling.inert &&
          !["SCRIPT", "STYLE", "LINK"].includes(sibling.tagName)
        ) {
          sibling.inert = true;
          inerted.push(sibling);
        }
      }
      if (parent.tagName === "DIALOG") break;
      branch = parent;
    }
    document.body.style.overflow = "hidden";
    return () => {
      closingAnimation.current?.cancel();
      dialog?.close();
      for (const element of inerted) element.inert = false;
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, [restoreFocusTo]);
  function requestClose() {
    if (closing.current) return;
    const dialog = ref.current;
    const surface = dialog?.querySelector<HTMLElement>(".dialog-surface");
    if (
      !surface ||
      typeof surface.animate !== "function" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      onClose();
      return;
    }
    closing.current = true;
    dialog!.dataset.closing = "true";
    const phone = matchMedia("(max-width: 767px)").matches;
    const animation = surface.animate(
      [
        { opacity: 1, transform: "none" },
        {
          opacity: 0,
          transform: `translateY(${phone ? 28 : 14}px) scale(${phone ? 1 : 0.99})`,
        },
      ],
      { duration: 180, easing: "cubic-bezier(.4,0,1,1)", fill: "forwards" },
    );
    closingAnimation.current = animation;
    animation.finished
      .then(() => {
        if (dialog?.isConnected) onClose();
      })
      .catch(() => {
        /* Navigation can unmount a closing sheet. */
      });
  }
  function trapFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const dialogs = document.querySelectorAll("dialog[open]");
    if (dialogs[dialogs.length - 1] !== ref.current) return;
    const focusable = Array.from(
      ref.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) || [],
    ).filter(
      (node) =>
        node.getClientRects().length && node.closest("dialog") === ref.current,
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const index = focusable.indexOf(document.activeElement as HTMLElement);
    if (!first) {
      event.preventDefault();
      return;
    }
    if (event.shiftKey && index <= 0) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && index === focusable.length - 1) {
      event.preventDefault();
      first.focus();
    }
  }
  return (
    <dialog
      ref={ref}
      aria-modal="true"
      onKeyDown={trapFocus}
      aria-labelledby={titleId}
      className={`dialog ${className}`}
      onCancel={(e) => {
        e.preventDefault();
        e.stopPropagation();
        requestClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      <div className="dialog-surface">
        <button
          className="icon-button dialog-close"
          aria-label={closeLabel}
          onClick={requestClose}
        >
          <Icon name="close" />
        </button>
        {children}
      </div>
    </dialog>
  );
}
