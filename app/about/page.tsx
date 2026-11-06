import { Page, PageHeader } from "@/components/page";
import { PhotoStack } from "@/components/photo-stack";
import {
  ABOUT_INTRO,
  ABOUT_SUMMARY,
  LOCATION,
  ROLE,
} from "@/lib/data";
export const metadata = { title: "About" };
export default function AboutPage() {
  return (
    <Page>
      <PageHeader
        back={{ href: "/", label: "Home" }}
        eyebrow="About / 2026"
        title="A product-minded engineer from General Santos."
      />
      <section className="about-editorial">
        <PhotoStack />
        <div className="identity about-identity">
          <div className="stack-v gap-4">
            <span className="identity-name">Profile</span>
            <span className="identity-role">
              {ROLE} · {LOCATION}
            </span>
          </div>
        </div>
        <div className="about-summary">
          <span className="label">About me</span>
          <p className="lead">{ABOUT_SUMMARY}</p>
        </div>
        {ABOUT_INTRO.map((paragraph) => (
          <p className="lead" key={paragraph}>
            {paragraph}
          </p>
        ))}
      </section>
    </Page>
  );
}
