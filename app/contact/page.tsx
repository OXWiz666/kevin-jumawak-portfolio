import { CopyEmail } from "@/components/copy-email";
import { Page, PageHeader } from "@/components/page";
import { EMAIL, GITHUB_URL } from "@/lib/data";
export const metadata = { title: "Contact" };
export default function ContactPage() {
  return (
    <Page>
      <PageHeader
        back={{ href: "/", label: "Home" }}
        title="Let’s connect"
        intro="For a conversation about software, systems, or collaboration."
      />
      <section className="stack-v gap-16">
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
