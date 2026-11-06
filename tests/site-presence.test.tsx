// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SitePresence } from "@/components/site-presence";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.unstubAllGlobals();
});

describe("SitePresence", () => {
  it("shows the current visitor and the shared total when it is available", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            kind: "success",
            totals: { lifetime: 1284, monthly: 32, month: "2026-11-01" },
          }),
        ),
      ),
    );

    render(<SitePresence />);

    expect(await screen.findByText("1 viewing now")).toBeTruthy();
    expect(await screen.findByText("1,284 total views")).toBeTruthy();
  });

  it("keeps a local total when the shared counter is unavailable", async () => {
    window.localStorage.setItem("portfolio-local-views", "12");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 503 })));

    render(<SitePresence />);

    await waitFor(() => expect(screen.getByText("13 total views")).toBeTruthy());
  });
});
