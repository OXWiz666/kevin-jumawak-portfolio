import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ForgeKeepMark } from "@/components/forgekeep-mark";
const { default: ProjectsPage } = await import("@/app/projects/page");
const { default: ProjectPage } = await import("@/app/projects/[slug]/page");
const { PROJECTS } = await import("@/lib/data");
describe("project routes", () => {
  it("lists ForgeKeep Wallet as in development", () => {
    const html = renderToStaticMarkup(createElement(ProjectsPage));
    expect(html).toContain("ForgeKeep Wallet");
    expect(html).toContain("In Development");
  });
  it("renders readable unavailable project content", async () => {
    const page = await ProjectPage({
      params: Promise.resolve({ slug: "draftiq" }),
    });
    expect(renderToStaticMarkup(page)).toContain("Not publicly available yet.");
  });
  it("uses official ForgeKeep visual metadata and verified feature content", () => {
    const forgeKeep = PROJECTS.find((project) => project.slug === "forgekeep");
    const renderedMark = renderToStaticMarkup(
      createElement(ForgeKeepMark, { variant: "row" }),
    );
    expect(forgeKeep?.images).toContain(
      "https://www.forgekeep.online/opengraph-image",
    );
    expect(forgeKeep?.technologies).toEqual(
      expect.arrayContaining([
        "Next.js",
        "Supabase",
        "PostgreSQL",
        "Prisma",
        "Hono.js",
      ]),
    );
    expect(JSON.stringify(forgeKeep?.sections)).toContain("Boss schedules");
    expect(renderedMark).toContain("ForgeKeep");
    expect(renderedMark).toContain("forgekeep-icon.png");
  });
});
