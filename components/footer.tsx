"use client";
import Link from "next/link";
import { useSite } from "./site-provider";
import { Icon, Mark } from "./icons";
import { instagramProfile } from "@/lib/social";
export function Footer({ demonstration = true }: { demonstration?: boolean }) {
  const { brand } = useSite();
  const instagram = instagramProfile(brand.instagram);
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Link href="/" className="brand">
          <Mark />
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
        <span>Made with intention.</span>
      </div>
    </footer>
  );
}
