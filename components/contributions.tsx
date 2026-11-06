import { GITHUB_URL } from "@/lib/data";
import {
  loadGitHubActivity,
  loadSelectedRepositories,
  type ContributionDay,
} from "@/lib/github";
import { NavIcons } from "@/components/icons";

function weeks(days: ContributionDay[]) {
  const result: ContributionDay[][] = [];
  for (let index = 0; index < days.length; index += 7)
    result.push(days.slice(index, index + 7));
  return result.slice(-52);
}
export async function Contributions() {
  const [activity, repositories] = await Promise.all([
    loadGitHubActivity(),
    loadSelectedRepositories(),
  ]);
  return (
    <section className="contributions-section">
      <div className="contributions-heading">
        <div>
          <span className="section-number">04 — Open source</span>
          <h2>GitHub activity</h2>
        </div>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="contributions-link">
          {activity.kind === "success"
            ? `${activity.total.toLocaleString()} contributions in the last year`
            : "View profile"}{" "}
          <NavIcons.arrowUpRight />
        </a>
      </div>
      {activity.kind === "success" ? (
        <div className="contributions-card">
          <div className="graph" aria-label="GitHub contribution graph">
            {weeks(activity.days).map((week, index) => (
              <div className="graph-week" key={index}>
                {week.map((day) => (
                  <span
                    key={day.date}
                    tabIndex={0}
                    className={`graph-day${day.level ? ` l${day.level}` : ""}`}
                    aria-label={`${day.count} contributions on ${day.date}`}
                    title={`${day.count} contributions on ${day.date}`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="graph-legend" aria-hidden="true">
            <span>Less</span><i /><i className="l1" /><i className="l2" /><i className="l3" /><i className="l4" /><span>More</span>
          </div>
        </div>
      ) : (
        <p className="placeholder">
          GitHub contribution activity is unavailable right now.
        </p>
      )}
      {repositories.length > 0 && (
        <div className="repository-list">
          {repositories.map((repository) => (
            <a
              className="row"
              key={repository.name}
              href={repository.url}
              target="_blank"
              rel="noreferrer"
            >
              <span className="row-body">
                <span className="row-title">{repository.name}</span>
                {repository.description && (
                  <span className="row-sub">{repository.description}</span>
                )}
              </span>
              <span className="row-tag">
                <NavIcons.arrowUpRight />
              </span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
