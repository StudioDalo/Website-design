import Link from "next/link";
import { Icon } from "@/components/icons";
export default function NotFound() {
  return (
    <main id="main" className="not-found">
      <span className="eyebrow">404 / A space yet to be filled</span>
      <h1>
        This page
        <br />
        is <em>off the plan.</em>
      </h1>
      <p>The project may be unpublished, or the address may have changed.</p>
      <Link className="button button-dark" href="/#work">
        Explore selected work <Icon />
      </Link>
    </main>
  );
}
