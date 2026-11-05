import Link from "next/link";
import { NavIcons } from "@/components/icons";
import { EMAIL, GITHUB_URL, NAME } from "@/lib/data";

export function PageHeader({
  title,
  intro,
  back,
}: {
  title: React.ReactNode;
  intro?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="stack-v gap-24">
      {back && (
        <Link href={back.href} className="back" transitionTypes={["nav-back"]}>
          <NavIcons.arrowLeft />
          {back.label}
        </Link>
      )}
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
          © {new Date().getFullYear()} {NAME}
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
