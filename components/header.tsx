"use client";
import Link from "next/link";
import { useSite } from "./site-provider";
import { useEffect, useRef, useState } from "react";
import { Dialog } from "./dialog";
import { Icon, Mark } from "./icons";
import { instagramProfile } from "@/lib/social";
const items = ["Work", "About", "Approach", "Contact"];
export function Header() {
  const { brand } = useSite();
  const instagram = instagramProfile(brand.instagram);
  const [menu, setMenu] = useState(false);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = header.current;
    if (!element) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const bounds = element.getBoundingClientRect();
      document.documentElement.style.setProperty(
        "--header-offset",
        `${Math.ceil(bounds.bottom + 20)}px`,
      );
      if (document.querySelector("dialog[open]")) return;
      const section = document
        .elementsFromPoint(innerWidth / 2, bounds.top + bounds.height / 2)
        .map((node) => node.closest<HTMLElement>("[data-nav-tone]"))
        .find(Boolean);
      element.dataset.tone =
        section?.dataset.navTone === "dark" ? "dark" : "light";
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = new ResizeObserver(request);
    resize.observe(element);
    resize.observe(document.body);
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    window.addEventListener("dalo-hero-tone", request);
    update();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      window.removeEventListener("dalo-hero-tone", request);
      document.documentElement.style.removeProperty("--header-offset");
    };
  }, []);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header ref={header} className="site-header" data-tone="light">
        <Link href="/" className="brand" aria-label={`${brand.name} home`}>
          <Mark />
          <span>
            STUDIO
            <br />
            {brand.wordmark.toUpperCase()}
            <span className="brand-dot">.</span>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {items.map((item) => (
            <Link
              key={item}
              href={`/#${item.toLowerCase()}`}
              className={item === "Contact" ? "contact-link" : ""}
            >
              {item}
              {item === "Contact" && <Icon />}
            </Link>
          ))}
        </nav>
        <Link className="mobile-contact" href="/#contact">
          Contact
        </Link>
        <button
          className="menu-button icon-button"
          onClick={() => setMenu(true)}
          aria-label="Open navigation"
          aria-expanded={menu}
        >
          <Icon name="menu" />
        </button>
      </header>
      {menu && (
        <Dialog
          onClose={() => setMenu(false)}
          titleId="menu-title"
          className="menu-dialog"
          closeLabel="Close navigation"
        >
          <span id="menu-title" className="eyebrow">
            Explore {brand.name}
          </span>
          <nav aria-label="Mobile navigation">
            {items.map((item, i) => (
              <Link
                key={item}
                href={`/#${item.toLowerCase()}`}
                onClick={() => setMenu(false)}
              >
                <small>0{i + 1}</small>
                {item}
                <Icon />
              </Link>
            ))}
          </nav>
          <p>
            Architecture, interiors and design
            <br />
            by Darlington.
          </p>
          {instagram && (
            <a
              className="menu-social"
              href={instagram.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {instagram.handle} <Icon />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </Dialog>
      )}
    </>
  );
}
