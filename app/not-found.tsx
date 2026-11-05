import { Page, PageHeader } from "@/components/page";
export default function NotFound() {
  return (
    <Page>
      <PageHeader
        back={{ href: "/", label: "Home" }}
        title="Page not found"
        intro="That page doesn’t exist, or it moved."
      />
    </Page>
  );
}
