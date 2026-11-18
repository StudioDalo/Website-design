"use client";
import { enquiryEmailHref } from "@/lib/contact";
import type { Project } from "@/lib/types";
import { useSite } from "./site-provider";
import { instagramProfile } from "@/lib/social";
import { Icon } from "./icons";
export function Contact({
  reference,
  onClearReference,
  projects,
}: {
  reference: string;
  onClearReference: () => void;
  projects: Project[];
}) {
  const { brand, home, labels } = useSite();
  const project = projects.find((p) => p.slug === reference);
  const instagram = instagramProfile(brand.instagram);
  const subject = project
    ? `Project enquiry — ${project.title}`
    : `Project enquiry — ${brand.name}`;
  return (
    <section
      id="contact"
      className="contact-section section-anchor"
      data-nav-tone="dark"
    >
      <div className="contact-heading" data-arrival>
        <span className="eyebrow">
          <span className="status-dot" />
          {labels.startConversation}
        </span>
        <h2 id="contact-title" tabIndex={-1}>
          {home.contactTitle}
          <br />
          <em>{home.contactEmphasis}</em>
        </h2>
        <p>{home.contactDescription}</p>
      </div>
      <div className="contact-routes">
        {project && (
          <div className="project-reference">
            <div>
              <span>In reference to</span>
              <strong>{project.title}</strong>
            </div>
            <button
              className="icon-button"
              aria-label="Remove project reference"
              onClick={onClearReference}
            >
              <Icon name="close" />
            </button>
          </div>
        )}
        <h3>Tell us about your project</h3>
        <p>
          A little about the space, where it is and what you have in mind is a
          helpful starting point.
        </p>
        {brand.email && (
          <a
            className="button button-light"
            href={enquiryEmailHref(brand.email, subject)}
          >
            Email the studio <Icon />
          </a>
        )}
        {instagram && (
          <a
            className="text-button"
            href={instagram.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact {instagram.handle} on Instagram <Icon />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
        {brand.email ? (
          <p>
            {brand.email} · Opens your email app. Your message is sent from
            there.
          </p>
        ) : instagram ? (
          <p>
            Open the studio’s Instagram profile and choose Message to discuss
            your idea.
          </p>
        ) : (
          <p>Contact details will be available here soon.</p>
        )}
        <a href="/privacy/" className="text-button">
          Privacy & storage <Icon />
        </a>
      </div>
    </section>
  );
}
