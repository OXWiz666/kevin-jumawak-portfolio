// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getIntroMode } from "@/lib/intro";

vi.mock("next/dynamic", () => ({
  default: () => () => null,
}));

const { PixelPetIntro } = await import("@/components/pixel-pet-intro");

function enableFirstVisit() {
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
  sessionStorage.clear();
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  document.documentElement.removeAttribute("data-intro-mode");
  sessionStorage.clear();
});

describe("getIntroMode", () => {
  it("plays only for a first home-page visit without reduced motion", () => {
    expect(
      getIntroMode({
        pathname: "/",
        hasSeenIntro: false,
        prefersReducedMotion: false,
      }),
    ).toBe("play");
  });

  it.each([
    { pathname: "/", hasSeenIntro: true, prefersReducedMotion: false },
    { pathname: "/", hasSeenIntro: false, prefersReducedMotion: true },
    { pathname: "/about", hasSeenIntro: false, prefersReducedMotion: false },
  ])("skips when $pathname is not an eligible first visit", (options) => {
    expect(getIntroMode(options)).toBe("skip");
  });
});

describe("PixelPetIntro", () => {
  it("marks the document as playing while the welcome dialog is open", async () => {
    enableFirstVisit();

    render(createElement(PixelPetIntro));

    expect(await screen.findByRole("dialog", { name: /portfolio/i })).toBeTruthy();
    expect(document.documentElement.dataset.introMode).toBe("play");
  });

  it("keeps keyboard focus inside the modal intro", async () => {
    enableFirstVisit();
    const shell = document.createElement("div");
    shell.className = "shell";
    document.body.append(shell);

    render(createElement(PixelPetIntro));

    const skip = await screen.findByRole("button", { name: "Skip" });
    await waitFor(() => expect(document.activeElement).toBe(skip));
    expect(shell.hasAttribute("inert")).toBe(true);

    fireEvent.keyDown(window, { key: "Tab" });
    expect(document.activeElement).toBe(skip);
    shell.remove();
  });

  it("keeps the home visible when reduced motion bypasses the intro", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    sessionStorage.clear();

    render(createElement(PixelPetIntro));

    await waitFor(() => {
      expect(document.documentElement.dataset.introMode).toBe("skip");
    });
    expect(screen.queryByRole("dialog", { name: /portfolio/i })).toBeNull();
  });

  it.each(["Escape", "Enter", " "])("dismisses the intro with %s", async (key) => {
    enableFirstVisit();
    render(createElement(PixelPetIntro));

    await screen.findByRole("dialog", { name: /portfolio/i });
    vi.useFakeTimers();
    fireEvent.keyDown(window, { key });
    act(() => vi.advanceTimersByTime(560));

    expect(screen.queryByRole("dialog", { name: /portfolio/i })).toBeNull();
    expect(sessionStorage.getItem("pet-intro-seen")).toBe("1");
  });

  it("dismisses the intro when Skip is pressed", async () => {
    enableFirstVisit();
    render(createElement(PixelPetIntro));

    await screen.findByRole("button", { name: "Skip" });
    vi.useFakeTimers();
    fireEvent.click(screen.getByRole("button", { name: "Skip" }));
    act(() => vi.advanceTimersByTime(560));

    expect(screen.queryByRole("dialog", { name: /portfolio/i })).toBeNull();
    expect(sessionStorage.getItem("pet-intro-seen")).toBe("1");
  });
});
