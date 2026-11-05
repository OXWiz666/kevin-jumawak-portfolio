"use client";
import { useRef, useState } from "react";
import { NavIcons } from "@/components/icons";
export function Carousel({ images, alt }: { images: string[]; alt: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const go = (next: number) => {
    const element = track.current;
    if (element)
      element.scrollTo({
        left: element.clientWidth * next,
        behavior: "smooth",
      });
  };
  return (
    <>
      <div
        className="carousel"
        ref={track}
        onScroll={(event) =>
          setIndex(
            Math.round(
              event.currentTarget.scrollLeft / event.currentTarget.clientWidth,
            ),
          )
        }
      >
        {images.map((image) => (
          <img className="shot" key={image} src={image} alt={alt} />
        ))}
      </div>
      {images.length > 1 && (
        <div className="carousel-nav">
          <span className="count">
            {index + 1} / {images.length}
          </span>
          <button
            className="foot-btn"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            aria-label="Previous image"
          >
            <NavIcons.arrowLeft />
          </button>
          <button
            className="foot-btn"
            onClick={() => go(index + 1)}
            disabled={index === images.length - 1}
            aria-label="Next image"
          >
            <NavIcons.arrowRight />
          </button>
        </div>
      )}
    </>
  );
}
