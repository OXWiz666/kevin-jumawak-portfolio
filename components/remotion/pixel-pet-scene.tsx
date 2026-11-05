"use client";

import type { CSSProperties } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * A tiny chibi cat, authored as a 20x16 pixel grid. The `#` silhouette is
 * shaded per cell from its neighbours, which gives every pixel block a
 * lit top-left and a shadowed bottom-right face - the "3D pixel" look.
 */
const ROWS = [
  "....###......###....",
  "...####.....####....",
  "...#####....#####...",
  "...##############...",
  "..################..",
  ".##################.",
  ".##################.",
  ".##################.",
  ".##################.",
  ".##################.",
  ".##################.",
  ".##################.",
  "..################..",
  "...##############...",
  "....############....",
  "....###......###....",
];

const GRID_W = 20;
const GRID_H = ROWS.length;
const CELL = 24;

type Tone =
  | "hi"
  | "up"
  | "base"
  | "down"
  | "lo"
  | "eye"
  | "glint"
  | "mouth"
  | "sprout";

const EYES = [
  { x: 3, y: 7 },
  { x: 13, y: 7 },
];

const FEATURE_MAP = new Map<string, Tone>();
for (const eye of EYES) {
  for (let dy = 0; dy < 3; dy++) {
    for (let dx = 0; dx < 4; dx++) {
      FEATURE_MAP.set(`${eye.x + dx},${eye.y + dy}`, "eye");
    }
  }
  // A single inner cell: sparkle on a dark eye, pupil on a light one.
  FEATURE_MAP.set(`${eye.x + 1},${eye.y + 1}`, "glint");
}
for (const [x, y] of [
  [9, 11],
  [10, 11],
  [8, 12],
  [11, 12],
]) {
  FEATURE_MAP.set(`${x},${y}`, "mouth");
}
for (const [x, y] of [
  [11, 2],
  [12, 1],
  [12, 0],
]) {
  FEATURE_MAP.set(`${x},${y}`, "sprout");
}

const TOKENS: Array<Array<Tone | null>> = ROWS.map((row, y) =>
  row.split("").map((char, x) => {
    if (char === ".") return null;
    const feature = FEATURE_MAP.get(`${x},${y}`);
    if (feature) return feature;
    const filled = (px: number, py: number) =>
      (ROWS[py]?.[px] ?? ".") !== ".";
    const lit = !filled(x, y - 1) || !filled(x - 1, y);
    const dark = !filled(x, y + 1) || !filled(x + 1, y);
    if (lit && !dark) return "hi";
    if (dark && !lit) return "lo";
    // Gentle top light so the blob reads as a volume, not a flat sticker.
    if (y <= 5) return "up";
    if (y >= 10) return "down";
    return "base";
  }),
);

const TONES: Record<Tone, CSSProperties> = {
  hi: { background: "color-mix(in oklab, var(--pet) 78%, white)" },
  up: { background: "color-mix(in oklab, var(--pet) 90%, white)" },
  base: { background: "var(--pet)" },
  down: { background: "color-mix(in oklab, var(--pet) 90%, black)" },
  lo: { background: "color-mix(in oklab, var(--pet) 78%, black)" },
  eye: { background: "var(--pet-paper)" },
  glint: { background: "var(--pet)" },
  mouth: { background: "var(--pet-paper)" },
  sprout: { background: "var(--green-ink)" },
};

const BEVEL: CSSProperties = {
  borderRadius: 2,
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.2)",
};

const FLAT = new Set<Tone>(["eye", "glint", "mouth"]);

const CELLS = TOKENS.flatMap((row, y) =>
  row.flatMap((tone, x) =>
    tone
      ? [{ key: `${x}-${y}`, tone, left: x * CELL, top: y * CELL }]
      : [],
  ),
);

export function PixelPetScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const drop = spring({
    frame: frame - 4,
    fps,
    config: { damping: 13, mass: 0.6, stiffness: 130 },
    durationInFrames: 46,
  });

  const fall = (1 - drop) * -160;
  const stretch = 1 + (1 - drop) * 0.06;
  const landAt = 34;
  const squash = Math.max(0, 1 - Math.abs(frame - landAt) / 8) * 0.14;
  const idle = frame > landAt + 8 ? Math.sin((frame - landAt - 8) / 15) * 5 : 0;
  const sway = Math.sin(frame / 26) * 2.4;

  const blinking =
    (frame >= 62 && frame <= 66) || (frame >= 122 && frame <= 126);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 460,
          height: 460,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--pet) 8%, transparent) 0%, transparent 68%)",
        }}
      />

      <div
        style={{
          position: "relative",
          width: GRID_W * CELL,
          height: GRID_H * CELL,
          transform: "translateY(14px)",
        }}
      >
        {/* Ground shadow, kept flat while the pet bobs above it. */}
        <div
          style={{
            position: "absolute",
            left: "12%",
            right: "12%",
            bottom: -30,
            height: 30,
            borderRadius: "50%",
            background:
              "light-dark(rgba(17,17,19,0.30), rgba(236,236,238,0.14))",
            filter: "blur(12px)",
            transform: `scaleX(${1 - Math.min(0.34, Math.abs(fall + idle) / 420)})`,
            opacity: Math.min(1, drop),
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "50% 88%",
            transform: `perspective(900px) rotateX(6deg) rotateY(${sway}deg) translateY(${fall + idle}px) scaleX(${1 + squash * 0.8}) scaleY(${stretch - squash})`,
            opacity: Math.min(1, drop * 1.6),
          }}
        >
          {CELLS.map((cell) => (
            <div
              key={cell.key}
              style={{
                position: "absolute",
                left: cell.left,
                top: cell.top,
                width: CELL + 0.5,
                height: CELL + 0.5,
                ...TONES[cell.tone],
                ...(FLAT.has(cell.tone) ? null : BEVEL),
              }}
            />
          ))}

          {/* Blink: swatch each eye with body colour and a closed-lid line. */}
          {blinking &&
            EYES.map((eye) => (
              <div
                key={eye.x}
                style={{
                  position: "absolute",
                  left: eye.x * CELL,
                  top: eye.y * CELL,
                  width: 4 * CELL + 0.5,
                  height: 3 * CELL + 0.5,
                  background: "var(--pet)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: CELL * 0.4,
                    right: CELL * 0.4,
                    top: CELL,
                    height: CELL * 0.55,
                    borderRadius: 2,
                    background: "color-mix(in oklab, var(--pet) 78%, black)",
                  }}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
