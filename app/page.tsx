import { Portfolio } from "@/components/portfolio";
import { jsonLd, studioStructuredData } from "@/lib/seo";
import { getContent } from "@/lib/content";
export default async function Home() {
  const { projects, settings } = await getContent();
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(studioStructuredData(settings)),
        }}
      />
      <Portfolio projects={projects} />
    </main>
  );
}
