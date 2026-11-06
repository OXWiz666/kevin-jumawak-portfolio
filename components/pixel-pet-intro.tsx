"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { DISPLAY_NAME, ROLE, STACK } from "@/lib/data";
import { getIntroMode } from "@/lib/intro";

const PixelPetPlayer = dynamic(
  () => import("@/components/remotion/pixel-pet-player"),
  { ssr: false },
);

const SEEN_KEY = "pet-intro-seen";
/** Long enough for the pet to land, blink and let the copy settle in. */
const PLAY_MS = 4_200;
const EXIT_MS = 560;

/** One flagship tool per stack group, so the intro mirrors the real stack. */
const SKILLS = STACK.map((group) => group.items[0]).slice(0, 6);

type Phase = "idle" | "playing" | "leaving";

/**
 * A one-per-session welcome: a small 3D pixel pet hops in, the name and the
 * tools it was built with fade up, then the gate dissolves into the home page.
 * Skipped entirely for reduced-motion visitors.
 */
export function PixelPetIntro() {
  // Start rendered so the server HTML contains an opaque gate. The root
  // bootstrap decides whether CSS shows it before React takes over.
  const [phase, setPhase] = useState<Phase>("playing");
  const shouldPlayRef = useRef(true);
  const skipButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let hasSeenIntro = false;
    try {
      hasSeenIntro = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}

    const mode = getIntroMode({
      pathname: window.location.pathname,
      hasSeenIntro,
      prefersReducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    });

    shouldPlayRef.current = mode === "play";
    document.documentElement.dataset.introMode = mode;
    if (mode === "skip") setPhase("idle");
  }, []);

  const dismiss = useCallback(() => {
    setPhase((current) => (current === "playing" ? "leaving" : current));
  }, []);

  useEffect(() => {
    if (phase !== "playing" || !shouldPlayRef.current) return;
    const root = document.documentElement;
    root.dataset.introMode = "play";

    const auto = window.setTimeout(dismiss, PLAY_MS);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        event.preventDefault();
        skipButtonRef.current?.focus({ preventScroll: true });
        return;
      }

      if (
        event.key === "Escape" ||
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        dismiss();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(auto);
      window.removeEventListener("keydown", onKey);
    };
  }, [phase, dismiss]);

  useEffect(() => {
    if (phase === "idle" || !shouldPlayRef.current) return;

    const shell = document.querySelector<HTMLElement>(".shell");
    shell?.setAttribute("inert", "");
    if (phase === "playing") {
      skipButtonRef.current?.focus({ preventScroll: true });
    }

    return () => shell?.removeAttribute("inert");
  }, [phase]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const done = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
      document.documentElement.dataset.introMode = "skip";
      setPhase("idle");
    }, EXIT_MS);
    return () => window.clearTimeout(done);
  }, [phase]);

  if (phase === "idle") return null;

  return (
    <div
      className={`pet-intro${phase === "leaving" ? " is-leaving" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${DISPLAY_NAME} portfolio`}
      onClick={dismiss}
    >
      <div className="pet-intro-body">
        <div className="pet-intro-stage" aria-hidden="true">
          <PixelPetPlayer />
        </div>
        <div className="pet-intro-copy">
          <span className="pet-intro-kicker">Portfolio</span>
          <p className="pet-intro-name">{DISPLAY_NAME}</p>
          <p className="pet-intro-role serif">{ROLE}</p>
          <ul className="pet-intro-skills" aria-label="Built with">
            {SKILLS.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
          <div className="pet-intro-meter" aria-hidden="true">
            <span />
          </div>
        </div>
      </div>
      <button
        ref={skipButtonRef}
        type="button"
        className="pet-intro-skip"
        onClick={(event) => {
          event.stopPropagation();
          dismiss();
        }}
      >
        Skip
      </button>
    </div>
  );
}
