"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NavIcons } from "@/components/icons";
import { HitCounter } from "@/components/hit-counter";
import { PixelName } from "@/components/pixel-name";
import {
  EMAIL,
  GITHUB_URL,
  LOCATION,
  PROJECTS,
  RESUME_URL,
  STACK,
  TIMEZONE,
} from "@/lib/data";
import { getNextTheme } from "@/lib/theme";
const items = [
  { href: "/", label: "Home", icon: "home" as const },
  { href: "/about", label: "About", icon: "about" as const },
  { href: "/experience", label: "Experience", icon: "experience" as const },
  {
    href: "/projects",
    label: "Projects",
    icon: "projects" as const,
    count: PROJECTS.length,
  },
  {
    href: "/stack",
    label: "Stack",
    icon: "stack" as const,
    count: STACK.reduce((n, group) => n + group.items.length, 0),
  },
  { href: "/contact", label: "Contact", icon: "contact" as const },
];
export function ThemeScript() {
  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html:
          "(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}})()",
      }}
    />
  );
}
function toggleTheme(button: HTMLButtonElement) {
  const root = document.documentElement;
  const nextTheme = getNextTheme(
    root.getAttribute("data-theme"),
    matchMedia("(prefers-color-scheme: dark)").matches,
  );
  const bounds = button.getBoundingClientRect();
  root.style.setProperty(
    "--theme-origin-x",
    `${bounds.left + bounds.width / 2}px`,
  );
  root.style.setProperty(
    "--theme-origin-y",
    `${bounds.top + bounds.height / 2}px`,
  );
  const applyTheme = () => {
    root.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {}
  };
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "startViewTransition" in document) {
    document.startViewTransition(applyTheme);
  } else {
    applyTheme();
  }
}
export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const home = pathname === "/";
  useEffect(() => setOpen(false), [pathname]);
  const closeDrawer = () => setOpen(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  }

  return (
    <>
      {home && (
        <header className="mobile-bar">
          <button
            className="icon-btn"
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            ☰
          </button>
          <Link className="mobile-bar-name" href="/">
            <PixelName />
          </Link>
          <span className="status">
            <span className="dot" />
            Available
          </span>
        </header>
      )}
      {open && (
        <div
          className="scrim"
          aria-hidden="true"
          onClick={closeDrawer}
        />
      )}
      <aside
        className={`sidebar${home ? "" : " sidebar-sub"}${open ? " is-open" : ""}`}
      >
        <div className="sidebar-panel">
          <div className="sidebar-top">
            <Link className="sidebar-name" href="/" transitionTypes={["nav-back"]}>
              <PixelName />
            </Link>
            <button
              className="icon-btn sidebar-close"
              type="button"
              aria-label="Close menu"
              onClick={closeDrawer}
            >
              <NavIcons.close />
            </button>
          </div>
          <button
            className={`sidebar-cta${copied ? " is-copied" : ""}`}
            type="button"
            onClick={copy}
          >
            <NavIcons.contact />
            <span className="sidebar-cta-label">
              {copied ? "Email copied" : "Contact"}
            </span>
            <span className="sidebar-cta-dot" />
          </button>
          <nav className="nav" aria-label="Main">
            <div className="nav-group">
              <span className="nav-label">Portfolio</span>
              {items.map((item) => {
                const Icon = NavIcons[item.icon];
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    className="nav-link"
                    aria-current={active ? "page" : undefined}
                    href={item.href}
                    key={item.href}
                    transitionTypes={
                      item.href === "/" ? ["nav-back"] : ["nav-forward"]
                    }
                  >
                    <Icon />
                    {item.label}
                    {item.count !== undefined && (
                      <span className="nav-count">
                        {String(item.count).padStart(2, "0")}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
          <HitCounter />
          <div className="sidebar-foot">
            <div className="sidebar-foot-text">
              <span className="sidebar-foot-place">{LOCATION}</span>
              <span>{TIMEZONE}</span>
            </div>
            <button
              className="foot-btn"
              type="button"
              onClick={(event) => toggleTheme(event.currentTarget)}
              aria-label="Toggle dark mode"
            >
              ◐
            </button>
            <a
              className="foot-btn"
              href={RESUME_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Open resume"
            >
              <NavIcons.resume />
            </a>
            <a
              className="foot-btn"
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              GH
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
