"use client";
import { useEffect } from "react";
export function ClickBurst() {
  useEffect(() => {
    const listener = (event: PointerEvent) => {
      if (
        event.pointerType !== "mouse" ||
        event.button !== 0 ||
        matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;
      const burst = document.createElement("div");
      burst.className = "click-burst";
      burst.style.left = `${event.clientX}px`;
      burst.style.top = `${event.clientY}px`;
      [45, 90, 135, 180, 225].forEach((angle) => {
        const line = document.createElement("span");
        line.style.setProperty("--a", `${angle}deg`);
        burst.append(line);
      });
      document.body.append(burst);
      setTimeout(() => burst.remove(), 500);
    };
    window.addEventListener("pointerdown", listener);
    return () => window.removeEventListener("pointerdown", listener);
  }, []);
  return null;
}
