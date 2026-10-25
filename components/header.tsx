"use client";
import Link from "next/link";
import { useSite } from "./site-provider";
import { useState } from "react";
import { Dialog } from "./dialog";
import { Icon, Mark } from "./icons";
const items = ["Work", "About", "Approach", "Contact"];
export function Header() {
  const { brand } = useSite();
  const [menu, setMenu] = useState(false);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <Link href="/" className="brand" aria-label={`${brand.name} home`}>
          <Mark />
          <span>
            STUDIO
            <br />
            {brand.wordmark.toUpperCase()}
            <span className="brand-dot">.</span>
          </span>
        </Link>
        <span className="header-note">
          Architecture, interiors
          <br />& a wider field of design.
        </span>
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
        </Dialog>
      )}
    </>
  );
}
