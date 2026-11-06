// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

const navigation = vi.hoisted(() => ({ pathname: "/" }));

function mockMatchMedia(matches = false) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: matches || query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
}));

const { Sidebar } = await import("@/components/sidebar");

afterEach(() => {
  cleanup();
  navigation.pathname = "/";
  vi.unstubAllGlobals();
});

describe("Sidebar drawer", () => {
  it("only exposes the close control while the mobile drawer is open", async () => {
    mockMatchMedia(true);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 503 })),
    );
    const user = userEvent.setup();

    render(<Sidebar />);

    expect(screen.queryByRole("button", { name: "Close menu" })).toBeNull();

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const close = screen.getByRole("button", { name: "Close menu" });
    expect(close).toBeTruthy();

    await user.click(close);
    expect(screen.queryByRole("button", { name: "Close menu" })).toBeNull();
  });

  it("keeps the mobile menu available on project pages", () => {
    navigation.pathname = "/projects/forgekeep";
    mockMatchMedia(true);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 503 })),
    );

    render(<Sidebar />);

    expect(screen.getByRole("button", { name: "Open menu" })).toBeTruthy();
  });

  it("hides and reveals the desktop sidebar with dedicated controls", async () => {
    mockMatchMedia();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 503 })),
    );
    const user = userEvent.setup();

    render(<Sidebar />);

    expect(screen.getByRole("link", { name: "Kevin Jumawak home" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Contact me" }).classList.contains("outline-action")).toBe(true);
    expect(screen.queryByText("Navigation")).toBeNull();
    expect(screen.getByRole("link", { name: /^Home$/ })).toBeTruthy();
    const sidebar = screen.getByRole("complementary", {
      name: "Portfolio sidebar",
    });
    await user.click(screen.getByRole("button", { name: "Hide sidebar" }));

    expect(sidebar.classList.contains("is-collapsed")).toBe(true);
    const reveal = screen.getByRole("button", { name: "Show sidebar" });
    expect(reveal.classList.contains("outline-action")).toBe(true);

    await user.click(reveal);
    expect(sidebar.classList.contains("is-collapsed")).toBe(false);
    expect(screen.queryByRole("button", { name: "Show sidebar" })).toBeNull();
  });
});
