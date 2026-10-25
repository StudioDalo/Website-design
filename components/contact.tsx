"use client";
import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import type { Project } from "@/lib/types";
import {
  deliverEnquiry,
  validateEnquiry,
  type Enquiry,
  type EnquiryErrors,
} from "@/lib/enquiry";
import { useSite } from "./site-provider";
import { Icon } from "./icons";
function subscribeHydration() {
  return () => {};
}
export function Contact({
  reference,
  onClearReference,
  projects,
}: {
  reference: string;
  onClearReference: () => void;
  projects: Project[];
}) {
  const { brand, home } = useSite();
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  );
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<"idle" | "pending" | "demo" | "error">(
    "idle",
  );
  const form = useRef<HTMLFormElement>(null);
  const project = projects.find((p) => p.slug === reference);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(
      ["name", "email", "company", "projectType", "location", "message"].map(
        (key) => [key, String(formData.get(key) || "").trim()],
      ),
    ) as Omit<Enquiry, "reference">;
    const enquiry = { ...data, reference: project?.title || "" };
    const issues = validateEnquiry(enquiry);
    setErrors(issues);
    setStatus("idle");
    if (Object.keys(issues).length) {
      const first = Object.keys(issues)[0];
      (form.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    setStatus("pending");
    try {
      await deliverEnquiry(enquiry);
      setStatus("demo");
    } catch {
      setStatus("error");
    }
  }
  function error(key: keyof Enquiry) {
    return (
      errors[key] && (
        <span className="field-error" id={`${key}-error`}>
          {errors[key]}
        </span>
      )
    );
  }
  const requiredProps = (key: keyof Enquiry) => ({
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
  });
  return (
    <section id="contact" className="contact-section section-anchor">
      <div className="contact-heading">
        <span className="eyebrow">
          <span className="status-dot" />
          Start a conversation
        </span>
        <h2 id="contact-title" tabIndex={-1}>
          {home.contactTitle}
          <br />
          <em>{home.contactEmphasis}</em>
        </h2>
        <p>{home.contactDescription}</p>
        {brand.email && (
          <a className="text-button" href={`mailto:${brand.email}`}>
            {brand.email}
            <Icon />
          </a>
        )}
        <p className="contact-demo-note">
          This is a demonstration form. Nothing is sent or stored. Your details
          stay in this page’s memory until you leave or refresh.
        </p>
      </div>
      <form
        ref={form}
        onSubmit={submit}
        noValidate
        className="contact-form"
        aria-labelledby="contact-form-title"
      >
        <h3 id="contact-form-title" className="eyebrow">
          Tell us a little about your idea
        </h3>
        {project && (
          <div className="project-reference">
            <div>
              <span className="eyebrow">In reference to</span>
              <strong>{project.title}</strong>
            </div>
            <button
              type="button"
              className="icon-button"
              aria-label="Remove project reference"
              onClick={onClearReference}
            >
              <Icon name="close" />
            </button>
          </div>
        )}
        <div className="form-grid">
          <label>
            Your name <span aria-hidden="true">*</span>
            <input
              name="name"
              autoComplete="name"
              maxLength={100}
              required
              {...requiredProps("name")}
            />
            {error("name")}
          </label>
          <label>
            Email address <span aria-hidden="true">*</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              required
              {...requiredProps("email")}
            />
            {error("email")}
          </label>
          <label>
            Company <span className="optional">optional</span>
            <input name="company" autoComplete="organization" maxLength={150} />
          </label>
          <label>
            Project type <span aria-hidden="true">*</span>
            <select
              name="projectType"
              required
              defaultValue=""
              {...requiredProps("projectType")}
            >
              <option value="" disabled>
                Select a discipline
              </option>
              {[
                ...new Set([
                  "Architecture",
                  "Interiors",
                  "Design",
                  ...projects.map((p) => p.discipline),
                ]),
              ].map((d) => (
                <option key={d}>{d}</option>
              ))}
              <option>Something else</option>
            </select>
            {error("projectType")}
          </label>
          <label className="full-field">
            Project location <span className="optional">optional</span>
            <input name="location" autoComplete="off" maxLength={150} />
          </label>
          <label className="full-field">
            What are you thinking? <span aria-hidden="true">*</span>
            <textarea
              name="message"
              rows={3}
              required
              minLength={10}
              maxLength={5000}
              placeholder="A little context, a few ideas, or simply a question…"
              {...requiredProps("message")}
            />
            {error("message")}
          </label>
        </div>
        <div className="form-submit">
          <small>* Required fields · Demo mode</small>
          <button
            className="button button-light"
            type="submit"
            disabled={!hydrated || status === "pending"}
          >
            {status === "pending" ? "Checking enquiry…" : "Preview enquiry"}
            <Icon />
          </button>
        </div>
        <div
          role="status"
          aria-live="polite"
          className={`form-status ${status === "demo" || status === "error" ? "visible" : ""}`}
        >
          {status === "demo" ? (
            <>
              <strong>Demo only—your enquiry has not been sent.</strong>
              <span>
                Your entries were validated locally. No external request was
                made and no personal details were saved.
              </span>
            </>
          ) : status === "error" ? (
            <>
              <strong>Your enquiry has not been sent.</strong>
              <span>The preview could not complete. Please try again.</span>
            </>
          ) : null}
        </div>
      </form>
    </section>
  );
}
