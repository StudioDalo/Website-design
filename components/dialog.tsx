"use client";
import { useEffect, useRef, type ReactNode, type KeyboardEvent } from "react";
import { Icon } from "./icons";
export function Dialog({
  children,
  titleId,
  onClose,
  className = "",
  closeLabel = "Close project",
}: {
  children: ReactNode;
  titleId: string;
  onClose: () => void;
  className?: string;
  closeLabel?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
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
      dialog?.close();
      for (const element of inerted) element.inert = false;
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);
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
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog-surface">
        <button
          className="icon-button dialog-close"
          aria-label={closeLabel}
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
        {children}
      </div>
    </dialog>
  );
}
