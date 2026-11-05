import { Page, PageHeader } from "@/components/page";
import { PhotoStack } from "@/components/photo-stack";
import {
  ABOUT_INTRO,
  ABOUT_SUMMARY,
  DISPLAY_NAME,
  LOCATION,
  ROLE,
} from "@/lib/data";
export const metadata = { title: "About" };
export default function AboutPage() {
  return (
    <Page>
      <PageHeader back={{ href: "/", label: "Home" }} title="More about me" />
      <section className="stack-v gap-24">
        <PhotoStack />
        <div className="identity">
          <div className="stack-v gap-4">
            <span className="identity-name">{DISPLAY_NAME}</span>
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
