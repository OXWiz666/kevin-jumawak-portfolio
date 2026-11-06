import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/contributions", () => ({
  Contributions: () => createElement("div", null, "GitHub activity"),
}));

const { default: Home } = await import("@/app/page");
const { default: ExperiencePage } = await import("@/app/experience/page");
const { default: ContactPage } = await import("@/app/contact/page");

describe("portfolio routes", () => {
  it("presents the editorial headline and contact route on home", () => {
    const html = renderToStaticMarkup(createElement(Home));
    expect(html).toContain("I turn complex ideas into");
    expect(html).toContain("useful software.");
    expect(html).toContain('href="/contact"');
    expect(html).toContain('href="https://github.com/OXWiz666"');
    expect(html).toContain('href="/documents/KevinJumawak-Resume.docx"');
  });

  it("uses the factual wide hero and a cardless portrait on home", () => {
    const html = renderToStaticMarkup(createElement(Home));

    expect(html).toContain('class="home-hero"');
    expect(html).toContain("BS Information Technology");
    expect(html).toContain('src="/images/kevin-jumawak-avatar.jfif"');
    expect(html).toContain('class="home-portrait home-portrait--minimal"');
    expect(html).not.toContain("home-portrait-card");
    expect(html).toContain("<figure");
    expect(html).toContain("General Santos City, Philippines");
  });

  it("puts ForgeKeep forward as the home page's featured product", () => {
    const html = renderToStaticMarkup(createElement(Home));

    expect(html).toContain("Featured project");
    expect(html).toContain("MMORPG Guild Management Platform");
    expect(html).toContain('href="https://forgekeep.online"');
    expect(html).toContain("View case study");
  });

  it("presents the supplied internship organization", () => {
    expect(renderToStaticMarkup(createElement(ExperiencePage))).toContain(
      "STI College General Santos",
    );
  });

  it("renders an email action without a server-side contact form", () => {
    const html = renderToStaticMarkup(createElement(ContactPage));
    expect(html).toContain("alphadaryl0425@gmail.com");
    expect(html).toContain("mailto:alphadaryl0425@gmail.com");
    expect(html).not.toContain("<form");
  });
});
