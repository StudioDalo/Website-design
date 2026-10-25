"use client";
import { createContext, useContext } from "react";
import { defaultSettings, type SiteSettings } from "@/lib/site-settings";
const Context = createContext<SiteSettings>(defaultSettings);
export function SiteProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  return <Context.Provider value={settings}>{children}</Context.Provider>;
}
export const useSite = () => useContext(Context);
