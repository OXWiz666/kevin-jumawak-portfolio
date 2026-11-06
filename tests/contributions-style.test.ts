import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("GitHub contribution styling", () => {
  it("uses the same compact purple contribution graph in both themes", () => {
    const css = readFileSync(resolve(process.cwd(), "app/globals.css"), "utf8");
    const finalGraphStyles = css.slice(css.lastIndexOf("/* Unified purple GitHub activity */"));

    expect(finalGraphStyles).toContain("width: min(100%, 780px)");
    expect(finalGraphStyles).toContain("#a855f7");
    expect(finalGraphStyles).not.toContain("#1b9c68");
    expect(finalGraphStyles).toContain(':root[data-theme="light"] .contributions-card');
    expect(finalGraphStyles).toContain(".graph-day:focus-visible");
  });
});
