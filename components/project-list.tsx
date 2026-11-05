"use client";
import Link from "next/link";
import { useState } from "react";
import { ForgeKeepMark } from "@/components/forgekeep-mark";
import type { Project } from "@/lib/data";
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
    <div className="stack-v">
      {shown.map((project, index) => (
        <Link
          className={`row${collapsible && !open && index === 2 ? " row-faded" : ""}`}
          href={`/projects/${project.slug}`}
          key={project.slug}
          aria-hidden={(collapsible && !open && index === 2) || undefined}
          tabIndex={collapsible && !open && index === 2 ? -1 : undefined}
        >
          <div className="thumb">
            {project.slug === "forgekeep" && <ForgeKeepMark variant="row" />}
          </div>
          <span className="row-body">
            <span className="row-title">
              {project.title}
              {project.status === "in-development" && (
                <span className="soon">In Development</span>
              )}
            </span>
            <span className="row-sub">{project.summary}</span>
          </span>
          <span className="row-tag">{project.category}</span>
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
