"use client";

import { ViewTransition } from "react";

/**
 * Root template: Next remounts this on navigation, which lets React's
 * ViewTransition drive the tab-change animation. The sidebar lives in the
 * layout, so it stays anchored while only the page body moves.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{
        "nav-forward": "tab-forward",
        "nav-back": "tab-back",
        default: "tab-fade",
      }}
      exit={{
        "nav-forward": "tab-forward",
        "nav-back": "tab-back",
        default: "tab-fade",
      }}
      default="tab-fade"
    >
      {children}
    </ViewTransition>
  );
}
