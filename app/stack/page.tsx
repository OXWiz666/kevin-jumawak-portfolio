import { Page, PageHeader } from "@/components/page";
import { STACK } from "@/lib/data";
export const metadata = { title: "Stack" };
export default function StackPage() {
  return (
    <Page>
      <PageHeader
        back={{ href: "/", label: "Home" }}
        eyebrow="Stack / Tools & systems"
        title="A practical toolkit for shipping software."
        intro="Technologies I use across interfaces, services, data, infrastructure, and intelligent automation."
      />
      <div className="stack-grid stack-archive">
        {STACK.map((group, index) => (
          <section className="stack-v gap-16" key={group.category}>
            <span className="stack-index">{String(index + 1).padStart(2, "0")}</span>
            <h2>{group.category}</h2>
            <div className="stack-v stack-list">
              {group.items.map((item) => (
                <div className="row" key={item}>
                  <span className="row-title">{item}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Page>
  );
}
