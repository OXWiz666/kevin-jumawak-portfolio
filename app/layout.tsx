import type { Metadata } from "next";
import { Figtree, Newsreader } from "next/font/google";
import { ReactLenis } from "lenis/react";
import { ClickBurst } from "@/components/click-burst";
import { Sidebar, ThemeScript } from "@/components/sidebar";
import { INTRO, NAME, ROLE } from "@/lib/data";
import "./globals.css";
const sans = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const serif = Newsreader({
  subsets: ["latin"],
  style: ["italic"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
});
export const metadata: Metadata = {
  title: { default: `${NAME} · ${ROLE}`, template: `%s · ${NAME}` },
  description: INTRO,
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <ReactLenis root options={{ stopInertiaOnNavigate: true }} />
        <ClickBurst />
        <div className="texture-layer" aria-hidden="true" />
        <div className="shell">
          <Sidebar />
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
