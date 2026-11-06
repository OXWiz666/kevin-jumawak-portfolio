// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HitCounter } from "@/components/hit-counter";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
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
    expect(screen.getByText("This month · 7")).toBeTruthy();
  });

  it("registers every rapid poke without a cooldown", async () => {
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
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            kind: "success",
            totals: { lifetime: 44, monthly: 9, month: "2026-10-01" },
          }),
        ),
      );
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    render(<HitCounter />);

    await screen.findByText("42");
    const button = await screen.findByRole("button", { name: /hit me/i });
    expect(button.classList.contains("outline-action")).toBe(true);
    await user.click(button);
    await user.click(button);

    expect(await screen.findByText("44")).toBeTruthy();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));
    expect(button.getAttribute("disabled")).toBeNull();
  });

  it("keeps poke interaction working locally when the shared counter is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 503 })));
    const user = userEvent.setup();

    render(<HitCounter />);

    const button = await screen.findByRole("button", { name: /hit me/i });
    await screen.findByRole("button", { name: /hit me/i });
    expect(screen.queryByText(/saved in this browser/i)).toBeNull();
    expect(button.getAttribute("disabled")).toBeNull();

    await user.click(button);
    expect(await screen.findByText("Mahurot ang token oy bomboang")).toBeTruthy();
    expect(screen.getByLabelText("Poke mascot")).toBeTruthy();
    expect(screen.getByRole("status").classList.contains("hit-feedback--burst")).toBe(true);
    expect(screen.getByRole("status").compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await user.click(button);
    await user.click(button);

    expect(await screen.findByText("3")).toBeTruthy();
    expect(window.localStorage.getItem("portfolio-local-pokes")).toBe("3");
  });
});
