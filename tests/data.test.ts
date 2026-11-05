import { describe, expect, it } from "vitest";
import {
  ABOUT_SUMMARY,
  AVATAR_URL,
  EMAIL,
  GITHUB_USERNAME,
  PROJECTS,
  RESUME_URL,
  SELECTED_REPOSITORIES,
} from "@/lib/data";

describe("portfolio identity data", () => {
  it("uses the supplied contact identity and unique project routes", () => {
    expect(EMAIL).toBe("alphadaryl0425@gmail.com");
    expect(GITHUB_USERNAME).toBe("OXWiz666");
    expect(new Set(PROJECTS.map((project) => project.slug)).size).toBe(
      PROJECTS.length,
    );
  });

  it("uses the supplied local portrait for the portfolio avatar", () => {
    expect(AVATAR_URL).toBe("/images/kevin-jumawak-avatar.jfif");
  });

  it("uses the supplied resume and hides the portfolio repository", () => {
    expect(RESUME_URL).toBe("/documents/KevinJumawak-Resume.docx");
    expect(SELECTED_REPOSITORIES).toEqual(["ai-bayanihan-challenge"]);
  });

  it("keeps the about summary concise and grounded in verified experience", () => {
    expect(ABOUT_SUMMARY).toContain("Full-stack developer");
  });
});
