import { ExperienceList } from "@/components/experience-list";
import { Page, PageHeader } from "@/components/page";
import { WORK } from "@/lib/data";
export const metadata = { title: "Experience" };
export default function ExperiencePage() {
  return (
    <Page>
      <PageHeader
        back={{ href: "/", label: "Home" }}
        eyebrow="Experience / 02 roles"
        title="Building products and supporting systems."
        intro="Hands-on experience across full-stack product work, technical operations, and practical IT support."
      />
      <section>
        <ExperienceList entries={WORK} />
      </section>
    </Page>
  );
}
