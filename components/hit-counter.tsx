"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { NavIcons } from "@/components/icons";

type HitTotals = { lifetime: number; monthly: number; month: string };
type HitState = "loading" | "success" | "local";

const LOCAL_POKE_KEY = "portfolio-local-pokes";
const POKE_MESSAGES = [
  "Mahurot ang token oy bomboang",
  "Tama na, kapoy kayka",
  "Agay, sakit na",
  "Hoy! sigeg pindot mahurot ang token",
];

function isHitResponse(value: unknown): value is {
  kind: "success";
  totals: HitTotals;
} {
  if (!value || typeof value !== "object") return false;
  const response = value as { kind?: unknown; totals?: unknown };
  if (response.kind !== "success" || !response.totals || typeof response.totals !== "object") {
    return false;
  }
  const totals = response.totals as Partial<HitTotals>;
  return (
    typeof totals.lifetime === "number" &&
    typeof totals.monthly === "number" &&
    Number.isSafeInteger(totals.lifetime) &&
    Number.isSafeInteger(totals.monthly) &&
    totals.lifetime >= 0 &&
    totals.monthly >= 0 &&
    typeof totals.month === "string"
  );
}

async function requestHit(method: "GET" | "POST"): Promise<HitTotals | null> {
  try {
    const response = await fetch("/api/hits", { method, cache: "no-store" });
    if (!response.ok) return null;
    const payload: unknown = await response.json();
    return isHitResponse(payload) ? payload.totals : null;
  } catch {
    return null;
  }
}

function readLocalPokes(): number {
  try {
    const value = Number(window.localStorage.getItem(LOCAL_POKE_KEY));
    return Number.isSafeInteger(value) && value >= 0 ? value : 0;
  } catch {
    return 0;
  }
}

function saveLocalPokes(value: number) {
  try {
    window.localStorage.setItem(LOCAL_POKE_KEY, String(value));
  } catch {}
}

export function HitCounter() {
  const [state, setState] = useState<HitState>("loading");
  const [totals, setTotals] = useState<HitTotals | null>(null);
  const [pulse, setPulse] = useState(0);
  const [feedback, setFeedback] = useState<{ id: number; text: string } | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const localPokes = useRef(0);
  const feedbackIndex = useRef(0);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    let active = true;
    localPokes.current = readLocalPokes();

    requestHit("GET").then((nextTotals) => {
      if (!active) return;
      if (nextTotals) {
        setTotals(nextTotals);
        setState("success");
      } else {
        setTotals({ lifetime: localPokes.current, monthly: 0, month: "local" });
        setState("local");
      }
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => () => clearTimeout(feedbackTimer.current), []);

  async function hit() {
    if (state === "loading") return;
    setPulse((value) => value + 1);
    const nextFeedback = {
      id: feedbackIndex.current,
      text: POKE_MESSAGES[feedbackIndex.current % POKE_MESSAGES.length],
    };
    feedbackIndex.current += 1;
    setFeedback(nextFeedback);
    clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 1100);

    if (state === "local") {
      const nextCount = localPokes.current + 1;
      localPokes.current = nextCount;
      saveLocalPokes(nextCount);
      setTotals({ lifetime: nextCount, monthly: 0, month: "local" });
      setAnnouncement(`${nextFeedback.text}. ${nextCount} local pokes.`);
      return;
    }

    const nextTotals = await requestHit("POST");
    if (!nextTotals) {
      const nextCount = localPokes.current + 1;
      localPokes.current = nextCount;
      saveLocalPokes(nextCount);
      setTotals({ lifetime: nextCount, monthly: 0, month: "local" });
      setState("local");
      setAnnouncement(`${nextFeedback.text}. Poke saved in this browser.`);
      return;
    }

    setTotals((current) => {
      if (!current) return nextTotals;
      return {
        ...nextTotals,
        lifetime: Math.max(current.lifetime, nextTotals.lifetime),
        monthly: Math.max(current.monthly, nextTotals.monthly),
      };
    });
    setAnnouncement(`${nextFeedback.text}. ${nextTotals.lifetime} total hits.`);
  }

  const disabled = state === "loading";
  const totalLabel = state === "loading" ? "…" : totals?.lifetime;

  return (
    <div className="sidebar-hit">
      <AnimatePresence initial={false} mode="wait">
        {feedback && (
          <motion.div
            className="hit-feedback hit-feedback--burst"
            exit={{ opacity: 0, y: -38, scale: 0.92, filter: "blur(3px)" }}
            initial={{ opacity: 0, y: 9, scale: 0.9, filter: "blur(2px)" }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [9, -2, -10, -35],
              scale: [0.9, 1, 1, 0.96],
              filter: ["blur(2px)", "blur(0px)", "blur(0px)", "blur(2px)"],
            }}
            transition={{ duration: 1.05, times: [0, 0.18, 0.58, 1], ease: "easeOut" }}
            key={`feedback-${feedback.id}`}
            role="status"
          >
            <motion.span
              className="poke-mascot"
              aria-label="Poke mascot"
              role="img"
              animate={{ rotate: [0, -10, 8, 0], y: [0, -4, 0] }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M8 12 5.5 6.5 13 9M24 12l2.5-5.5L19 9" />
                <path d="M7 14c0-5 4-8 9-8s9 3 9 8v7c0 4-4 6-9 6s-9-2-9-6z" />
                <path d="M12 17h.01M20 17h.01M13 21c1.7 1.5 4.3 1.5 6 0" />
              </svg>
            </motion.span>
            <span>{feedback.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        className="hit-button outline-action"
        type="button"
        onClick={hit}
        disabled={disabled}
        aria-label="Hit me with a hammer"
      >
        <span
          className={`hit-button-hammer${pulse ? " is-animating" : ""}`}
          key={`hammer-${pulse}`}
          aria-hidden="true"
        >
          <NavIcons.hammer />
        </span>
        <span className="hit-button-copy">
          <span>Poke me</span>
          <span className="hit-button-total" key={`total-${totalLabel}`}>{totalLabel}</span>
        </span>
        <span
          className={`hit-button-impact${pulse ? " is-animating" : ""}`}
          key={`impact-${pulse}`}
          aria-hidden="true"
        />
      </button>
      {state !== "local" && (
        <p className="hit-month">
          {state === "success" ? (
          <>This month · {totals?.monthly}</>
          ) : (
            <>Loading activity…</>
          )}
        </p>
      )}
      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>
    </div>
  );
}
