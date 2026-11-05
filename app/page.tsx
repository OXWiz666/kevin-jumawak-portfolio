import Link from "next/link";
import { Contributions } from "@/components/contributions";
import { PixelPetIntro } from "@/components/pixel-pet-intro";
import { Page } from "@/components/page";import { PixelName } from "@/components/pixel-name";
import { ProjectList } from "@/components/project-list";
import {
  ABOUT_SUMMARY,
  AVATAR_URL,
  DISPLAY_NAME,
  HEADLINE,
  HIGHLIGHTS,
  LOCATION,
  PROJECTS,
  ROLE,
  STACK,
} from "@/lib/data";
export default function Home() {
  return (
    <Page>
      <PixelPetIntro />
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-portrait">
          <img src={AVATAR_URL} alt={DISPLAY_NAME} className="home-avatar" />
          <span className="home-portrait-note">General Santos City, PH</span>
        </div>
        <div className="home-profile">
          <div className="home-identity">
            <span className="identity-name">
              <PixelName />
            </span>
            <span className="identity-role">{ROLE}</span>
          </div>
          <h1 className="home-title" id="home-title">
            {HEADLINE.lead} <span className="serif">{HEADLINE.emphasis}</span>
          </h1>
          <p className="lead">{ABOUT_SUMMARY}</p>
          <div className="home-actions">
            <Link className="btn btn-dark" href="/contact">
              Get in touch
            </Link>
            <Link className="underline" href="/about">
              More about me
            </Link>
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
      </section>
      <section className="stack-v gap-16">
        <div className="section-head">
          <h2 className="label">Selected projects</h2>
          <Link className="count" href="/projects">
            View all
          </Link>
        </div>
        <ProjectList projects={PROJECTS.slice(0, 3)} />
      </section>
      <section className="stack-v gap-16">
        <div className="section-head">
          <h2 className="label">Stack</h2>
          <Link className="count" href="/stack">
            View all
          </Link>
        </div>
        <div className="stack-v">
          {STACK.slice(0, 3).map((group) => (
            <div className="kv" key={group.category}>
              <span>{group.category}</span>
              <span>{group.items.join(", ")}</span>
            </div>
          ))}
        </div>
      </section>
      <Contributions />
    </Page>
  );
}
