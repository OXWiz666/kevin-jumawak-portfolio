import Link from "next/link";
import { NavIcons } from "@/components/icons";
import { EMAIL, GITHUB_URL } from "@/lib/data";

export function PageHeader({
  title,
  intro,
  back,
  eyebrow = "Portfolio / 2026",
}: {
  title: React.ReactNode;
  intro?: React.ReactNode;
  back?: { href: string; label: string };
  eyebrow?: string;
}) {
  return (
    <header className="page-header">
      {back && (
        <Link href={back.href} className="back" transitionTypes={["nav-back"]}>
          <NavIcons.arrowLeft />
          {back.label}
        </Link>
      )}
      <span className="page-eyebrow">{eyebrow}</span>
      <h1 className="page-title">{title}</h1>
      {intro && <p className="lead">{intro}</p>}
    </header>
  );
}
export function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="column">
      {children}
      <footer className="footer">
        <span>
          © {new Date().getFullYear()} Kevin Jumawak.
        </span>
        <nav aria-label="Social">
          <a href={`mailto:${EMAIL}`}>Email</a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
      </footer>
    </div>
  );
}
