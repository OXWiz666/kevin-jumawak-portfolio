import Link from "next/link";
import { Contributions } from "@/components/contributions";
import { Page } from "@/components/page";
import { ProjectList } from "@/components/project-list";
import {
  ABOUT_SUMMARY,
  AVATAR_URL,
  DISPLAY_NAME,
  GITHUB_URL,
  HEADLINE,
  HIGHLIGHTS,
  LOCATION,
  PROJECTS,
  RESUME_URL,
  ROLE,
  STACK,
} from "@/lib/data";

export default function Home() {
  const forgeKeep = PROJECTS.find((project) => project.slug === "forgekeep");

  if (!forgeKeep) return null;

  return (
    <Page>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-profile">
          <span className="home-kicker">Portfolio / 2026</span>
          <span className="home-role">{ROLE}</span>
          <h1 className="home-title" id="home-title">Kevin<br />Jumawak.</h1>
          <p className="home-statement">
            {HEADLINE.lead} <span className="serif">{HEADLINE.emphasis}</span>
          </p>
          <p className="lead">{ABOUT_SUMMARY}</p>
          <div className="home-actions">
            <Link className="btn btn-dark" href="/contact">
              Get in touch <span aria-hidden="true">↗</span>
            </Link>
            <a className="home-quick-link" href={GITHUB_URL} target="_blank" rel="noreferrer">
              GitHub <span aria-hidden="true">↗</span>
            </a>
            <a className="home-quick-link" href={RESUME_URL} target="_blank" rel="noreferrer">
              Resume <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="home-availability">
            <span className="chip chip-dark">
              <span className="dot" />
              Available for software engineering
            </span>
            <span className="home-location">{LOCATION}</span>
          </div>
          <div className="home-facts">
            {HIGHLIGHTS.map((item) => (
              <div className="home-fact" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
        <figure className="home-portrait home-portrait--minimal">
          <img
            src={AVATAR_URL}
            alt={DISPLAY_NAME}
            className="home-avatar"
            width="640"
            height="720"
          />
        </figure>
      </section>

      <section className="featured-project" aria-labelledby="featured-project-title">
        <div className="featured-copy">
          <span className="section-number">01 — Featured project</span>
          <div className="featured-title-row">
            <h2 id="featured-project-title">{forgeKeep.title}</h2>
            <span aria-hidden="true">↗</span>
          </div>
          <p className="featured-subtitle">MMORPG Guild Management Platform</p>
          <p className="featured-description">{forgeKeep.summary}</p>
          <ul className="featured-capabilities" aria-label="ForgeKeep capabilities">
            <li>Guilds</li><li>Boss timers</li><li>DKP &amp; loot</li><li>Discord</li>
          </ul>
          <div className="featured-tags" aria-label="ForgeKeep technologies">
            {forgeKeep.technologies.map((technology) => <span key={technology}>{technology}</span>)}
          </div>
          <div className="home-actions">
            <Link className="btn btn-dark" href={`/projects/${forgeKeep.slug}`}>
              View case study <span aria-hidden="true">→</span>
            </Link>
            <a className="btn btn-light" href={forgeKeep.liveUrl} target="_blank" rel="noreferrer">
              Visit ForgeKeep <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className="featured-visual" aria-label="ForgeKeep product preview">
          <div className="featured-visual-backdrop" aria-hidden="true" />
          <figure className="forgekeep-preview">
            <img src={forgeKeep.images[0]} alt={forgeKeep.imageAlt} />
            <figcaption>Official ForgeKeep site preview</figcaption>
          </figure>
        </div>
      </section>

      <section className="stack-v gap-16 selected-projects">
        <div className="section-head">
          <h2 className="section-number">02 — Selected projects</h2>
          <Link className="count" href="/projects">View all</Link>
        </div>
        <ProjectList projects={PROJECTS.slice(1)} />
      </section>
      <section className="stack-v gap-16">
        <div className="section-head">
          <h2 className="section-number">03 — Stack</h2>
          <Link className="count" href="/stack">View all</Link>
        </div>
        <div className="stack-v">
          {STACK.slice(0, 3).map((group) => (
            <div className="kv" key={group.category}>
              <span>{group.category}</span><span>{group.items.join(", ")}</span>
            </div>
          ))}
        </div>
      </section>
      <Contributions />
    </Page>
  );
}
