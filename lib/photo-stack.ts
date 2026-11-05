export type PhotoDirection = "left" | "right";

export function getPhotoIndex(
  activeIndex: number,
  photoCount: number,
  direction: PhotoDirection,
): number {
  if (photoCount < 1) return 0;
  const offset = direction === "left" ? -1 : 1;
  return (activeIndex + offset + photoCount) % photoCount;
}
