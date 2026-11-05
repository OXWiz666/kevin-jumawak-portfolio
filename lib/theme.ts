export type Theme = "light" | "dark";

export function getNextTheme(
  currentTheme: string | null,
  systemPrefersDark: boolean,
): Theme {
  const isDark = currentTheme ? currentTheme === "dark" : systemPrefersDark;
  return isDark ? "light" : "dark";
}
