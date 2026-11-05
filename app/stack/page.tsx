import { Page, PageHeader } from "@/components/page";
import { STACK } from "@/lib/data";
export const metadata = { title: "Stack" };
export default function StackPage() {
  return (
    <Page>
      <PageHeader
        back={{ href: "/", label: "Home" }}
        title="Stack"
        intro="The technologies I use across software engineering, architecture, and automation."
      />
      <div className="stack-grid">
        {STACK.map((group) => (
          <section className="stack-v gap-16" key={group.category}>
            <h2 className="label">{group.category}</h2>
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
