import { describe, expect, it } from "vitest";
import { getNextTheme } from "@/lib/theme";
import { getPhotoIndex } from "@/lib/photo-stack";

describe("theme selection", () => {
  it("switches an explicit dark theme to light", () => {
    expect(getNextTheme("dark", false)).toBe("light");
  });

  it("uses the system preference only when no theme was saved", () => {
    expect(getNextTheme(null, true)).toBe("light");
  });
});

describe("photo stack direction", () => {
  it("moves the left photo selection to the previous card", () => {
    expect(getPhotoIndex(0, 3, "left")).toBe(2);
  });

  it("moves the right photo selection to the next card", () => {
    expect(getPhotoIndex(2, 3, "right")).toBe(0);
  });
});
