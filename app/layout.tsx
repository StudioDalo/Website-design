import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getContent } from "@/lib/content";
import { SiteProvider } from "@/components/site-provider";
import "./globals.css";
const sans = localFont({
  src: "../assets/fonts/Manrope.woff2",
  variable: "--font-dalo-sans",
  display: "swap",
  weight: "200 800",
});
const serif = localFont({
  src: [
    {
      path: "../assets/fonts/InstrumentSerif-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/InstrumentSerif-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-dalo-serif",
  display: "swap",
});
export async function generateMetadata(): Promise<Metadata> {
  const {
    projects,
    settings: { brand },
  } = await getContent();
  return {
    title: {
      default: `${brand.name} — Architecture, Interiors & Design`,
      template: `%s — ${brand.name}`,
    },
    description:
      brand.description +
      (projects.some((p) => p.placeholder)
        ? " An evolving portfolio with clearly labelled demonstration content."
        : ""),
    robots: { index: false, follow: false },
    icons: { icon: "/icon.svg" },
  };
}
export const viewport: Viewport = {
  themeColor: "#f1f0e8",
  width: "device-width",
  initialScale: 1,
};
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { settings, projects } = await getContent();
  return (
    <html
      lang="en"
      data-body-font={settings.appearance.bodyFont}
      data-heading-font={settings.appearance.headingFont}
      data-text-size={settings.appearance.textSize}
      className={`${sans.variable} ${serif.variable}`}
    >
      <body id="top">
        <SiteProvider settings={settings}>
          <Header />
          {children}
          <Footer demonstration={projects.some((p) => p.placeholder)} />
        </SiteProvider>
      </body>
    </html>
  );
}
