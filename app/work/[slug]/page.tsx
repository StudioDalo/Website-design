import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectStory } from "@/components/project-story";
import { Icon } from "@/components/icons";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { neighbors } from "@/lib/catalog";

export const dynamicParams = false;
export async function generateStaticParams() {
  const { projects } = await getContent();
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { projects, settings } = await getContent();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project not found" };
  return pageMetadata(settings, project);
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { projects } = await getContent();
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return (
    <main id="main" className="project-page">
      <Link className="back-to-work text-button" href="/#work">
        <Icon name="left" />
        Back to selected work
      </Link>
      <ProjectStory project={project} {...neighbors(projects, project.slug)} />
    </main>
  );
}
