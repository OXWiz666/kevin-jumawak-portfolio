"use client";

import { useState } from "react";

const FORGEKEEP_LOGO_URL = "https://www.forgekeep.online/forgekeep-icon.png";

export function ForgeKeepMark({ variant }: { variant: "row" | "hero" }) {
  const [failed, setFailed] = useState(false);

  return (
    <span className={`forgekeep-mark forgekeep-mark-${variant}`}>
      {failed ? (
        <span className="forgekeep-mark-fallback" aria-label="ForgeKeep">
          FK
        </span>
      ) : (
        <img
          src={FORGEKEEP_LOGO_URL}
          alt="ForgeKeep logo"
          onError={() => setFailed(true)}
        />
      )}
      <span className="sr-only">ForgeKeep</span>
    </span>
  );
}
