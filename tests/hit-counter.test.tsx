// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HitCounter } from "@/components/hit-counter";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("HitCounter", () => {
  it("shows the server total and month total after loading", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            kind: "success",
            totals: { lifetime: 42, monthly: 7, month: "2026-10-01" },
          }),
        ),
      ),
    );

    render(<HitCounter />);

    expect(await screen.findByText("42")).toBeTruthy();
    expect(screen.getByText("Hit this month · 7")).toBeTruthy();
  });

  it("does not send a second increment during the local cooldown", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            kind: "success",
            totals: { lifetime: 42, monthly: 7, month: "2026-10-01" },
          }),
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            kind: "success",
            totals: { lifetime: 43, monthly: 8, month: "2026-10-01" },
          }),
        ),
      );
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    render(<HitCounter />);

    await screen.findByText("42");
    const button = await screen.findByRole("button", { name: /hit me/i });
    await user.click(button);
    expect(await screen.findByText("43")).toBeTruthy();
    await user.click(button);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("keeps the sidebar calm when the counter is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 503 })));

    render(<HitCounter />);

    expect(await screen.findByText("Unavailable")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /hit me/i }).getAttribute("disabled"),
    ).not.toBeNull();
  });
});
