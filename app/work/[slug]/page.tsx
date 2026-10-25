import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectStory } from "@/components/project-story";
import { Icon } from "@/components/icons";
import { getContent } from "@/lib/content";
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
  const {
    projects,
    settings: { brand },
  } = await getContent();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project not found" };
  const description = project.introduction;
  const url = brand.siteUrl
    ? `${brand.siteUrl}/work/${project.slug}`
    : undefined;
  return {
    title: project.title,
    description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      title: `${project.title} — ${brand.name}`,
      description,
      type: "article",
      ...(url ? { url } : {}),
      ...(!project.placeholder && brand.siteUrl
        ? {
            images: [
              {
                url: new URL(project.hero.src, brand.siteUrl).href,
                width: project.hero.width,
                height: project.hero.height,
                alt: project.hero.alt,
              },
            ],
          }
        : {}),
    },
  };
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
