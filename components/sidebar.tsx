"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
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
  const [contactOpen, setContactOpen] = useState(false);
  const contactPopoverId = useId();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!contactOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setContactOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [contactOpen]);
  const closeDrawer = () => setOpen(false);

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
          <div className="sidebar-contact">
            <button
              className="sidebar-cta outline-action"
              type="button"
              aria-expanded={contactOpen}
              aria-controls={contactPopoverId}
              onClick={() => setContactOpen((current) => !current)}
            >
              <NavIcons.contact />
              <span className="sidebar-cta-label">Contact me</span>
              <span className="sidebar-cta-dot" />
            </button>
            {contactOpen && (
              <div
                className="contact-popover"
                id={contactPopoverId}
                role="dialog"
                aria-label="Contact Kevin Jumawak"
              >
                <span>Start an email conversation</span>
                <a href={`mailto:${EMAIL}?subject=${encodeURIComponent("Portfolio inquiry")}`}>
                  <NavIcons.contact />
                  Email Kevin
                </a>
              </div>
            )}
          </div>
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
          <div className="sidebar-foot">
            <div className="sidebar-activity sidebar-activity--footer">
              <span className="nav-label">Activity</span>
              <HitCounter />
              <SitePresence />
            </div>
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
