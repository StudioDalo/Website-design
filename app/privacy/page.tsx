import Link from "next/link";
import type { Metadata } from "next";
import { getContent } from "@/lib/content";
export const metadata: Metadata = {
  title: "Privacy & storage",
  robots: { index: false, follow: true },
  alternates: { canonical: "/privacy/" },
};
export default async function Privacy() {
  const {
    settings: { brand },
  } = await getContent();
  return (
    <main id="main" className="information-page">
      <Link href="/">Back to {brand.name}</Link>
      <h1>Privacy & storage</h1>
      <p>
        This explains the website’s current use of information and browser
        storage.
      </p>
      <h2>Browsing the portfolio</h2>
      <p>
        The website does not include advertising pixels or visitor analytics. It
        remembers your Wall or Index view in your browser’s local storage under
        “dalo-view”. This stores a display preference, not your name, email or
        enquiry. You can clear it through your browser’s site-data settings.
      </p>
      <h2>Contacting the studio</h2>
      <p>
        The website does not collect or submit enquiry form entries. Email links
        open your own email application; Instagram links open Instagram. Those
        services process messages under their own policies. The studio receives
        information you choose to send and uses it to respond to your enquiry
        and discuss potential work.
      </p>
      <h2>Hosting and project media</h2>
      <p>
        Netlify hosts the website, and Sanity supplies published project content
        and images. Requests to these services include technical information
        such as your IP address and browser information. Their operational
        logging and retention are governed by their service policies. Uploaded
        portfolio media is public.
      </p>
      <h2>Editor sign-in</h2>
      <p>
        The /admin/ editor uses Sanity authentication for authorised members.
        Its sign-in and session storage are separate from the public portfolio.
        Visitors do not need to sign in to browse projects.
      </p>
      <h2>Questions and changes</h2>
      <p>
        {brand.email ? (
          <>
            For questions about information you have sent, contact{" "}
            <a href={`mailto:${brand.email}`}>{brand.email}</a>.
          </>
        ) : brand.instagram ? (
          <>
            Contact the studio through <a href={brand.instagram}>Instagram</a>{" "}
            for questions about information you have sent.
          </>
        ) : (
          "Public contact details will be added to the website."
        )}{" "}
        If tracking, online forms or other data processing are introduced, this
        information and any required consent controls should be updated.
      </p>
      <p>
        Last updated: 18 November 2026. This notice describes the implemented
        website; provider retention and the studio’s enquiry-handling
        arrangements should be confirmed by the owner.
      </p>
    </main>
  );
}
