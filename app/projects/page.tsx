import { Page, PageHeader } from "@/components/page";
import { ProjectList } from "@/components/project-list";
import { PROJECTS } from "@/lib/data";
export const metadata = { title: "Projects" };
export default function ProjectsPage() {
  return (
    <Page>
      <PageHeader
        back={{ href: "/", label: "Home" }}
        title="Projects"
        intro="A selection of applications and products I’m currently building."
      />
      <section className="stack-v gap-16">
        <div className="section-head">
          <h2 className="label">Selected work</h2>
          <span className="count">
            {String(PROJECTS.length).padStart(2, "0")}
          </span>
        </div>
        <ProjectList projects={PROJECTS} />
      </section>
    </Page>
  );
}
