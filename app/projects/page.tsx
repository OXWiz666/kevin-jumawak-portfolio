import { Page, PageHeader } from "@/components/page";
import { ProjectList } from "@/components/project-list";
import { PROJECTS } from "@/lib/data";
export const metadata = { title: "Projects" };
export default function ProjectsPage() {
  return (
    <Page>
      <PageHeader
        back={{ href: "/", label: "Home" }}
        eyebrow="Selected work / 2026"
        title="Products, platforms, and useful software."
        intro="A focused archive of live products, completed systems, and ideas currently taking shape."
      />
      <section className="projects-archive">
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
