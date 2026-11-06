"use client";

import { useEffect, useState } from "react";

const LOCAL_VIEW_KEY = "portfolio-local-views";

function readLocalViews() {
  try {
    const value = Number(window.localStorage.getItem(LOCAL_VIEW_KEY));
    return Number.isSafeInteger(value) && value >= 0 ? value : 0;
  } catch {
    return 0;
  }
}

function saveLocalViews(value: number) {
  try {
    window.localStorage.setItem(LOCAL_VIEW_KEY, String(value));
  } catch {}
}

export function SitePresence() {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    const localViews = readLocalViews() + 1;
    saveLocalViews(localViews);
    setViews(localViews);

    fetch("/api/hits", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        const payload: unknown = await response.json();
        if (
          !payload ||
          typeof payload !== "object" ||
          !("totals" in payload) ||
          !payload.totals ||
          typeof payload.totals !== "object" ||
          !("lifetime" in payload.totals) ||
          typeof payload.totals.lifetime !== "number"
        ) {
          return null;
        }
        return payload.totals.lifetime;
      })
      .then((sharedViews) => {
        if (active && sharedViews !== null) setViews(sharedViews);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="site-presence" aria-label="Site activity">
      <span className="site-presence-live"><i aria-hidden="true" />1 viewing now</span>
      <span>{views === null ? "Loading views…" : `${views.toLocaleString()} total views`}</span>
    </div>
  );
}
