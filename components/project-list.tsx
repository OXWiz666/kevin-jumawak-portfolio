"use client";
import Link from "next/link";
import { useState } from "react";
import { ForgeKeepMark } from "@/components/forgekeep-mark";
import { PROJECT_STATUS_LABELS, type Project } from "@/lib/data";

function projectMonogram(title: string) {
  return title
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
export function ProjectList({
  projects,
  collapsible = false,
}: {
  projects: Project[];
  collapsible?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const shown = collapsible && !open ? projects.slice(0, 3) : projects;
  return (
    <div className="project-list">
      {shown.map((project, index) => (
        <Link
          className={`project-row${collapsible && !open && index === 2 ? " row-faded" : ""}`}
          href={`/projects/${project.slug}`}
          key={project.slug}
          aria-hidden={(collapsible && !open && index === 2) || undefined}
          tabIndex={collapsible && !open && index === 2 ? -1 : undefined}
        >
          <span className="project-row-index">{String(index + 1).padStart(2, "0")}</span>
          <div className="project-thumb">
            {project.slug === "forgekeep" ? (
              <ForgeKeepMark variant="row" />
            ) : (
              <span aria-hidden="true">{projectMonogram(project.title)}</span>
            )}
          </div>
          <span className="project-row-body">
            <strong>{project.title}</strong>
            <span>{project.summary}</span>
          </span>
          <span className="project-row-meta">
            <span className={`status-badge status-${project.status}`}>
              <span className="status-dot" />
              {PROJECT_STATUS_LABELS[project.status]}
            </span>
            <span className="project-row-tech">
              {project.technologies.slice(0, 3).join(" · ")}
            </span>
          </span>
          <span className="project-row-arrow" aria-hidden="true">↗</span>
        </Link>
      ))}
      {collapsible && projects.length > 2 && (
        <button
          className="more-btn"
          type="button"
          onClick={() => setOpen(!open)}
        >
          {open ? "Show less" : `+ ${projects.length - 2} more`}
        </button>
      )}
    </div>
  );
}
