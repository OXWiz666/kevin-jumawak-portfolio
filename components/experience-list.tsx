"use client";
import { useState } from "react";
import type { WorkEntry } from "@/lib/data";
export function ExperienceList({ entries }: { entries: WorkEntry[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="stack-v experience-details">
      {entries.map((entry) => (
        <article
          className="stack-v gap-16"
          key={entry.role}
          style={{ padding: "18px 0", borderTop: "1px solid var(--line)" }}
        >
          <div className="section-head">
            <span className="row-title">
              {entry.role}
              {entry.organization && (
                <span style={{ color: "var(--muted)" }}>
                  {" "}
                  · {entry.organization}
                </span>
              )}
            </span>
            <span className="count">{entry.period}</span>
          </div>
          {entry.tags.length > 0 ? (
            <span className="row-sub">{entry.tags.join(" · ")}</span>
          ) : (
            <span className="row-sub">
              Technology details not publicly listed.
            </span>
          )}
          {entry.details.length > 0 && (
            <>
              <button
                className="experience-toggle"
                type="button"
                aria-expanded={open === entry.role}
                onClick={() => setOpen(open === entry.role ? null : entry.role)}
              >
                {open === entry.role ? "Hide details" : "Show details"}
              </button>
              {open === entry.role && (
                <ul className="bullets">
                  {entry.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              )}
            </>
          )}
        </article>
      ))}
    </div>
  );
}
