"use client";
import Link from "next/link";
import { useSite } from "./site-provider";
import { BrandMark } from "./brand-mark";
import { Icon } from "./icons";
import { instagramProfile } from "@/lib/social";
export function Footer({ demonstration = true }: { demonstration?: boolean }) {
  const { brand, labels } = useSite();
  const instagram = instagramProfile(brand.instagram);
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Link href="/" className="brand">
          <BrandMark />
          <span>{brand.name.toUpperCase()}.</span>
        </Link>
        <p>{brand.description}</p>
        <div className="footer-links">
          {instagram && (
            <a href={instagram.url} target="_blank" rel="noopener noreferrer">
              {instagram.handle} <Icon />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          <a href="#top">
            Back to top{" "}
            <Icon name="up" style={{ transform: "rotate(-45deg)" }} />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {brand.name}
        </span>
        {demonstration && (
          <span>Demonstration portfolio · Generated mood imagery</span>
        )}
        <span>{labels.footerNote}</span>
        <Link href="/privacy/">Privacy & storage</Link>
        <Link href="/brand/">Brand assets</Link>
      </div>
    </footer>
  );
}
