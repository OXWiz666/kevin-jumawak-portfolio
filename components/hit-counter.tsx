"use client";

import { useEffect, useRef, useState } from "react";
import { NavIcons } from "@/components/icons";

type HitTotals = { lifetime: number; monthly: number; month: string };
type HitState = "loading" | "success" | "unavailable";

const COOLDOWN_MS = 1_500;
const COOLDOWN_KEY = "portfolio-hit-cooldown-until";

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

function readCooldown(): number {
  try {
    const value = Number(window.localStorage.getItem(COOLDOWN_KEY));
    return Number.isFinite(value) && value > Date.now() ? value : 0;
  } catch {
    return 0;
  }
}

function saveCooldown(until: number) {
  try {
    window.localStorage.setItem(COOLDOWN_KEY, String(until));
  } catch {}
}

export function HitCounter() {
  const [state, setState] = useState<HitState>("loading");
  const [totals, setTotals] = useState<HitTotals | null>(null);
  const [coolingDown, setCoolingDown] = useState(false);
  const [isHit, setIsHit] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const cooldownTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const animationTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    let active = true;
    const until = readCooldown();
    if (until) {
      setCoolingDown(true);
      cooldownTimer.current = setTimeout(
        () => active && setCoolingDown(false),
        until - Date.now(),
      );
    }

    requestHit("GET").then((nextTotals) => {
      if (!active) return;
      if (nextTotals) {
        setTotals(nextTotals);
        setState("success");
      } else {
        setState("unavailable");
      }
    });

    return () => {
      active = false;
      clearTimeout(cooldownTimer.current);
      clearTimeout(animationTimer.current);
    };
  }, []);

  async function hit() {
    if (state !== "success" || coolingDown) return;

    const until = Date.now() + COOLDOWN_MS;
    saveCooldown(until);
    setCoolingDown(true);
    setIsHit(true);
    clearTimeout(animationTimer.current);
    animationTimer.current = setTimeout(() => setIsHit(false), 520);
    clearTimeout(cooldownTimer.current);
    cooldownTimer.current = setTimeout(() => setCoolingDown(false), COOLDOWN_MS);

    const nextTotals = await requestHit("POST");
    if (!nextTotals) {
      setState("unavailable");
      setAnnouncement("Hit counter is temporarily unavailable.");
      return;
    }

    setTotals(nextTotals);
    setAnnouncement(`Hit registered. ${nextTotals.lifetime} total hits.`);
  }

  const unavailable = state === "unavailable";
  const disabled = state !== "success" || coolingDown;
  const totalLabel = state === "success" ? totals?.lifetime : unavailable ? "Unavailable" : "…";
  const monthLabel = state === "success" ? totals?.monthly : unavailable ? "Unavailable" : "Loading";

  return (
    <div className="sidebar-hit">
      <button
        className={`hit-button${isHit ? " is-hit" : ""}`}
        type="button"
        onClick={hit}
        disabled={disabled}
        aria-label="Hit me with a hammer"
      >
        <span className="hit-button-hammer" aria-hidden="true">
          <NavIcons.hammer />
        </span>
        <span className="hit-button-copy">
          <span>Hit me</span>
          <span className="hit-button-total">{totalLabel}</span>
        </span>
        {isHit && <span className="hit-button-pop" aria-hidden="true">+1</span>}
        <span className="hit-button-impact" aria-hidden="true" />
      </button>
      <p className="hit-month">Hit this month · {monthLabel}</p>
      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>
    </div>
  );
}
