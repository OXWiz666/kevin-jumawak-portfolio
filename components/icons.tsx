type IconProps = { size?: number };
function Stroke({
  size = 16,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}
export const NavIcons = {
  home: () => (
    <Stroke>
      <path d="m2.5 7 5.5-4.5L13.5 7v6.5H9.5v-4h-3v4h-4z" />
    </Stroke>
  ),
  about: () => (
    <Stroke>
      <circle cx="8" cy="5.5" r="2.8" />
      <path d="M2.5 14c.8-2.7 3-4 5.5-4s4.7 1.3 5.5 4" />
    </Stroke>
  ),
  experience: () => (
    <Stroke>
      <rect x="2" y="5" width="12" height="8.5" rx="1.2" />
      <path d="M5.5 5V3.5h5V5" />
    </Stroke>
  ),
  projects: () => (
    <Stroke>
      <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" />
      <rect x="9" y="2.5" width="4.5" height="4.5" rx="1" />
      <rect x="2.5" y="9" width="4.5" height="4.5" rx="1" />
      <rect x="9" y="9" width="4.5" height="4.5" rx="1" />
    </Stroke>
  ),
  stack: () => (
    <Stroke>
      <path d="M8 2 14 5 8 8 2 5z" />
      <path d="m2 8.5 6 3 6-3M2 11.5l6 3 6-3" />
    </Stroke>
  ),
  contact: () => (
    <Stroke>
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" />
      <path d="m2.5 4.5 5.5 4 5.5-4" />
    </Stroke>
  ),
  arrowLeft: () => (
    <Stroke>
      <path d="M13 8H3m4-4L3 8l4 4" />
    </Stroke>
  ),
  arrowRight: () => (
    <Stroke>
      <path d="M3 8h10m-4-4 4 4-4 4" />
    </Stroke>
  ),
  arrowUpRight: () => (
    <Stroke>
      <path d="m5 11 6-6M6 5h5v5" />
    </Stroke>
  ),
  close: () => (
    <Stroke>
      <path d="m4 4 8 8M12 4l-8 8" />
    </Stroke>
  ),
  resume: () => (
    <Stroke>
      <path d="M4 2.5h5l3 3v8H4z" />
      <path d="M9 2.5v3h3M6 9h4M6 11.5h3" />
    </Stroke>
  ),
  hammer: () => (
    <Stroke>
      <path d="m8.6 7.4 4.1 4.1-1.6 1.6L7 9" />
      <path d="m4 3 4.5 1.5L7 7 2.5 5.5z" />
      <path d="m6.7 5.3 1 1" />
    </Stroke>
  ),
};
