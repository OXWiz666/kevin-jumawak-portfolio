import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Carousel } from "@/components/carousel";
import { Page } from "@/components/page";
import {
  PROJECTS,
  PROJECT_STATUS_LABELS,
  getProject,
} from "@/lib/data";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return {
    title: project?.title ?? "Project",
    description: project?.summary,
  };
}

function sectionId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function monogram(title: string) {
  return title
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const projectIndex = PROJECTS.findIndex((item) => item.slug === project.slug);
  const nextProject = PROJECTS[(projectIndex + 1) % PROJECTS.length];

  return (
    <Page>
      <article className="case-study">
        <header className="case-hero">
          <Link href="/projects" className="back" transitionTypes={["nav-back"]}>
            ← All projects
          </Link>
          <span className="case-kicker">
            {String(projectIndex + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")} · Case study
          </span>
          <div className="case-hero-grid">
            <div className="case-heading">
              <div className="case-title-line">
                <h1>{project.title}</h1>
                <span aria-hidden="true">↗</span>
              </div>
              <p>{project.summary}</p>
              <div className="case-actions">
                {project.liveUrl && (
                  <a className="btn btn-dark" href={project.liveUrl} target="_blank" rel="noreferrer">
                    Visit live product <span aria-hidden="true">↗</span>
                  </a>
                )}
                {project.githubUrl && (
                  <a className="btn btn-light" href={project.githubUrl} target="_blank" rel="noreferrer">
                    View repository <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </div>
            <aside className="case-facts" aria-label="Project details">
              <div><span>Status</span><strong className={`status-badge status-${project.status}`}><i className="status-dot" />{PROJECT_STATUS_LABELS[project.status]}</strong></div>
              <div><span>Type</span><strong>{project.category}</strong></div>
              <div><span>Stack</span><strong>{project.technologies.join(" · ")}</strong></div>
            </aside>
          </div>
        </header>

        {project.images.length ? (
          <section className="case-media" aria-labelledby="case-preview-title">
            <span className="case-section-label" id="case-preview-title">Product preview</span>
            <Carousel images={project.images} alt={project.imageAlt ?? `${project.title} preview`} />
          </section>
        ) : (
          <section className="case-placeholder" aria-label={`${project.title} project identity`}>
            <span>{monogram(project.title)}</span>
            <p>{project.category}</p>
          </section>
        )}

        <div className="case-body">
          <aside className="case-index">
            <span className="case-section-label">Inside the project</span>
            <nav aria-label="Case study sections">
              {project.sections.map((section, index) => (
                <a href={`#${sectionId(section.title)}`} key={section.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>{section.title}
                </a>
              ))}
            </nav>
          </aside>
          <div className="case-content">
            {project.sections.map((section, index) => (
              <section id={sectionId(section.title)} key={section.title}>
                <span className="case-section-label">{String(index + 1).padStart(2, "0")}</span>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.items && (
                  <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>
                )}
              </section>
            ))}
          </div>
        </div>

        <Link className="next-project" href={`/projects/${nextProject.slug}`}>
          <span>Next project</span>
          <strong>{nextProject.title} <i aria-hidden="true">↗</i></strong>
        </Link>
      </article>
    </Page>
  );
}
