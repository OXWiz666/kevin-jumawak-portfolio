"use client";
import { useEffect, useRef, useState } from "react";
import { DISPLAY_NAME } from "@/lib/data";
const PALETTE = [17, 90, 170];
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const BLOCKS = [8, 6, 4, 3, 2, 1];
function draw(el: HTMLElement, canvas: HTMLCanvasElement, block: number) {
  const s = getComputedStyle(el);
  const { width, height } = el.getBoundingClientRect();
  const w = Math.ceil(width / block),
    h = Math.ceil(height / block);
  if (!w || !h) return;
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = `${w * block}px`;
  canvas.style.height = `${h * block}px`;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.font = `${s.fontWeight} ${parseFloat(s.fontSize) / block}px ${s.fontFamily}`;
  const m = ctx.measureText(DISPLAY_NAME);
  ctx.fillText(
    DISPLAY_NAME,
    0,
    (height / block - m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2 +
      m.fontBoundingBoxAscent,
  );
  const image = ctx.getImageData(0, 0, w, h);
  for (let p = 0; p < w * h; p++) {
    const x = p % w,
      y = Math.floor(p / w);
    const i = Math.floor(
      (1 - image.data[p * 4 + 3] / 255) * 3 +
        (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16,
    );
    if (i < 3)
      image.data[p * 4] =
        image.data[p * 4 + 1] =
        image.data[p * 4 + 2] =
          PALETTE[i];
    image.data[p * 4 + 3] = i < 3 ? 255 : 0;
  }
  ctx.putImageData(image, 0, 0);
}
export function PixelName() {
  const text = useRef<HTMLSpanElement>(null),
    canvas = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches)
      return setDone(true);
    let step = 0;
    let timer = 0;
    let cancelled = false;
    const frame = () => {
      if (cancelled) return;
      if (step === BLOCKS.length) return setDone(true);
      draw(text.current!, canvas.current!, BLOCKS[step++]);
      timer = window.setTimeout(frame, 90);
    };
    document.fonts.ready.then(frame);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);
  return (
    <span ref={text} className={`pixel-name${done ? "" : " is-pixel"}`}>
      {DISPLAY_NAME}
      {!done && <canvas ref={canvas} width={0} height={0} aria-hidden="true" />}
    </span>
  );
}
