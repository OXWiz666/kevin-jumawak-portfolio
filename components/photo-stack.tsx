"use client";

import { useState } from "react";
import { getPhotoIndex, type PhotoDirection } from "@/lib/photo-stack";

type PhotoStackProps = { photos?: Array<string | null> };

function directionForPhoto(
  index: number,
  active: number,
  count: number,
): PhotoDirection | null {
  if (index === active) return null;
  return (index - active + count) % count === 1 ? "right" : "left";
}

export function PhotoStack({ photos = [null, null, null] }: PhotoStackProps) {
  const [active, setActive] = useState(0);

  function move(direction: PhotoDirection) {
    setActive((current) => getPhotoIndex(current, photos.length, direction));
  }

  return (
    <div className="photo-stack">
      <div
        className="photo-stack-cards"
        role="group"
        aria-label="Profile photos"
      >
        {photos.map((photo, index) => {
          const direction = directionForPhoto(index, active, photos.length);
          const position = direction ? ` is-${direction}` : " is-current";
          return (
            <button
              aria-label={
                direction
                  ? `Move photos ${direction}`
                  : `Photo ${index + 1} of ${photos.length}`
              }
              className={`photo-card${position}`}
              key={index}
              onClick={() => direction && move(direction)}
              style={{ zIndex: direction ? (direction === "left" ? 2 : 3) : 4 }}
              type="button"
            >
              {photo ? (
                <img src={photo} alt="" />
              ) : (
                <span>Photo unavailable</span>
              )}
            </button>
          );
        })}
      </div>
      <span className="photo-hint">
        Click a side photo to move it left or right
      </span>
    </div>
  );
}
