import type { WorkEntry } from "@/lib/data";

export function ExperienceList({ entries }: { entries: WorkEntry[] }) {
  return (
    <div className="experience-list">
      {entries.map((entry, index) => (
        <article className="experience-entry" key={entry.role}>
          <span className="experience-index">{String(index + 1).padStart(2, "0")}</span>
          <div className="experience-main">
            <span className="experience-period">{entry.period}</span>
            <h2>{entry.role}</h2>
            {entry.organization && <p className="experience-org">{entry.organization}</p>}
            <ul>
              {entry.details.map((detail) => <li key={detail}>{detail}</li>)}
            </ul>
            <div className="experience-tags">
              {entry.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
