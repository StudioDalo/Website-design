import { Portfolio } from "@/components/portfolio";
import { getContent } from "@/lib/content";
export default async function Home() {
  const { projects } = await getContent();
  return (
    <main id="main">
      <Portfolio projects={projects} />
    </main>
  );
}
