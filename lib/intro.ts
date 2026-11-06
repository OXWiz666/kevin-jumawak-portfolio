export type IntroMode = "play" | "skip";

export function getIntroMode({
  pathname,
  hasSeenIntro,
  prefersReducedMotion,
}: {
  pathname: string;
  hasSeenIntro: boolean;
  prefersReducedMotion: boolean;
}): IntroMode {
  return pathname === "/" && !hasSeenIntro && !prefersReducedMotion
    ? "play"
    : "skip";
}
