"use client";
import { useSyncExternalStore } from "react";
type Connection = EventTarget & { saveData?: boolean };
function connection() {
  return (navigator as Navigator & { connection?: Connection }).connection;
}
function subscribe(callback: () => void) {
  const query = matchMedia("(prefers-reduced-motion: reduce)");
  const network = connection();
  query.addEventListener("change", callback);
  network?.addEventListener("change", callback);
  return () => {
    query.removeEventListener("change", callback);
    network?.removeEventListener("change", callback);
  };
}
function snapshot() {
  return (
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !!connection()?.saveData
  );
}
export function useQuietMotion() {
  return useSyncExternalStore(subscribe, snapshot, () => false);
}
