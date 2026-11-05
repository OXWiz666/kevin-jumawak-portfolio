"use client";
import { useRef, useState, type ReactNode } from "react";
export function CopyEmail({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  async function copy(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!navigator.clipboard) return;
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(href.replace("mailto:", ""));
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = href;
    }
  }
  return (
    <>
      <a href={href} className={className} onClick={copy}>
        {children}
      </a>
      <span className="toast" role="status">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </>
  );
}
