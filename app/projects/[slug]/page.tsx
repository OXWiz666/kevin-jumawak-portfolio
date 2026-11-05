import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Carousel } from "@/components/carousel";
import { ForgeKeepMark } from "@/components/forgekeep-mark";
import { Page, PageHeader } from "@/components/page";
import { PROJECTS, getProject } from "@/lib/data";
export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: getProject(slug)?.title ?? "Project" };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return (
    <Page>
      <PageHeader
        back={{ href: "/projects", label: "All projects" }}
        title={project.title}
        intro={project.summary}
      />
      <div className="stack-v gap-40">
        {project.slug === "forgekeep" && <ForgeKeepMark variant="hero" />}
        <div className="niche">
          <span className="chip chip-dark">{project.category}</span>
          {project.status === "in-development" && (
            <span className="chip chip-light">In Development</span>
          )}
          {project.liveUrl && (
            <a
              className="chip chip-light"
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
            >
              Live website
            </a>
          )}
          {project.githubUrl && (
            <a
              className="chip chip-light"
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          )}
        </div>
        {project.images.length ? (
          <section className="gallery">
            <span className="label">Official site preview</span>
            <Carousel
              images={project.images}
              alt={project.imageAlt ?? `${project.title} project preview`}
            />
          </section>
        ) : (
          <p className="placeholder">
            Screenshots are not publicly available yet.
          </p>
        )}
        {project.sections.map((section) => (
          <section className="stack-v gap-16" key={section.title}>
            <h2 className="label">{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p className="lead" key={paragraph}>
                {paragraph}
              </p>
            ))}
            {section.items && (
              <ul className="bullets">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <section className="stack-v gap-16">
          <h2 className="label">Technology stack</h2>
          {project.technologies.length ? (
            <div className="kv">
              <span>Tools</span>
              <span>{project.technologies.join(", ")}</span>
            </div>
          ) : (
            <p className="placeholder">Not publicly available yet.</p>
          )}
        </section>
      </div>
    </Page>
  );
}
