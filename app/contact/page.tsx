import { CopyEmail } from "@/components/copy-email";
import { Page, PageHeader } from "@/components/page";
import { EMAIL, GITHUB_URL } from "@/lib/data";
export const metadata = { title: "Contact" };
export default function ContactPage() {
  return (
    <Page>
      <PageHeader
        back={{ href: "/", label: "Home" }}
        eyebrow="Contact / Open to work"
        title={<>Have an idea worth <span className="serif">building?</span></>}
        intro="I’m interested in meaningful projects, thoughtful engineering, and opportunities to create something useful."
      />
      <section className="contact-actions">
        <CopyEmail className="btn btn-dark" href={`mailto:${EMAIL}`}>
          Copy {EMAIL}
        </CopyEmail>
        <a
          className="btn btn-light"
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
        >
          GitHub profile
        </a>
      </section>
    </Page>
  );
}
