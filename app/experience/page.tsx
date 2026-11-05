import { ExperienceList } from "@/components/experience-list";
import { Page, PageHeader } from "@/components/page";
import { WORK } from "@/lib/data";
export const metadata = { title: "Experience" };
export default function ExperiencePage() {
  return (
    <Page>
      <PageHeader
        back={{ href: "/", label: "Home" }}
        title="Experience"
        intro="Professional experience and education details currently available for publication."
      />
      <section className="stack-v gap-16">
        <h2 className="label">Roles</h2>
        <ExperienceList entries={WORK} />
      </section>
    </Page>
  );
}
