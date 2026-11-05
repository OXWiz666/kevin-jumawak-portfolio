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
  it("presents the supplied headline and contact route on home", () => {
    const html = renderToStaticMarkup(createElement(Home));
    expect(html).toContain("I build software that solves");
    expect(html).toContain("real problems.");
    expect(html).toContain('href="/contact"');
  });

  it("uses the factual wide hero and larger portrait on home", () => {
    const html = renderToStaticMarkup(createElement(Home));

    expect(html).toContain('class="home-hero"');
    expect(html).toContain("BS Information Technology");
    expect(html).toContain('src="/images/kevin-jumawak-avatar.jfif"');
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
