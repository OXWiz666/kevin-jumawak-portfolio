"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SlidingText } from "@animate-ui/react/primitives/texts/sliding";
import { NavIcons } from "@/components/icons";
import { HitCounter } from "@/components/hit-counter";
import { SitePresence } from "@/components/site-presence";
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
  { href: "/", label: "Home" },
  {
    href: "/projects",
    label: "Projects",
    count: PROJECTS.length,
  },
  {
    href: "/experience",
    label: "Experience",
    count: 2,
  },
  {
    href: "/stack",
    label: "Stack",
    count: STACK.reduce((n, group) => n + group.items.length, 0),
  },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
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
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
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
      <header className="mobile-bar">
        <button
          className="icon-btn"
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => {
            setCollapsed(false);
            setOpen(true);
          }}
        >
          ☰
        </button>
        <Link className="mobile-bar-name" href="/" aria-label="KJ. Mobile home">
          KJ.
        </Link>
        <span className="status">
          <span className="dot" />
          Available
        </span>
      </header>
      {open && (
        <div
          className="scrim"
          aria-hidden="true"
          onClick={closeDrawer}
        />
      )}
      <aside
        className={`sidebar${open ? " is-open" : ""}${collapsed ? " is-collapsed" : ""}`}
        aria-label="Portfolio sidebar"
        inert={collapsed}
      >
        <div className="sidebar-panel">
          <div className="sidebar-top">
            <Link
              className="sidebar-brand"
              href="/"
              aria-label="Kevin Jumawak home"
              transitionTypes={["nav-back"]}
            >
              <span className="sidebar-brand-name">Kevin Jumawak</span>
            </Link>
            <div className="sidebar-top-actions">
              <button
                className="icon-btn sidebar-desktop-hide"
                type="button"
                aria-label="Hide sidebar"
                title="Hide sidebar"
                onClick={() => setCollapsed(true)}
              >
                <NavIcons.arrowLeft />
              </button>
              {open && (
                <button
                  className="icon-btn sidebar-close"
                  type="button"
                  aria-label="Close menu"
                  onClick={closeDrawer}
                >
                  <NavIcons.close />
                </button>
              )}
            </div>
          </div>
          <div className="sidebar-status">
            <span className="dot" />
            Available for work
          </div>
          <button
            className={`sidebar-cta outline-action${copied ? " is-copied" : ""}`}
            type="button"
            onClick={copy}
          >
            <NavIcons.contact />
            <span className="sidebar-cta-label">
              {copied ? "Email copied" : "Contact me"}
            </span>
            <span className="sidebar-cta-dot" />
          </button>
          <nav className="nav" aria-label="Main">
            <div className="nav-group">
              {items.map((item) => {
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
                    <SlidingText
                      className="sidebar-nav-text"
                      direction="up"
                      text={item.label}
                    />
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
          <div className="sidebar-activity">
            <span className="nav-label">Activity</span>
            <HitCounter />
            <SitePresence />
          </div>
          <div className="sidebar-foot">
            <div className="sidebar-foot-text">
              <span className="sidebar-foot-place">{LOCATION}</span>
              <span>{TIMEZONE}</span>
            </div>
            <button
              className="foot-btn outline-action"
              type="button"
              onClick={(event) => toggleTheme(event.currentTarget)}
              aria-label="Toggle dark mode"
            >
              ◐
            </button>
            <a
              className="foot-btn outline-action"
              href={RESUME_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Open resume"
            >
              <NavIcons.resume />
            </a>
            <a
              className="foot-btn outline-action"
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
      {collapsed && (
        <button
          className="sidebar-reveal outline-action"
          type="button"
          aria-label="Show sidebar"
          title="Show sidebar"
          onClick={() => setCollapsed(false)}
        >
          <NavIcons.arrowRight />
          <span>Menu</span>
        </button>
      )}
    </>
  );
}
