import type { Metadata } from "next";
import { Bodoni_Moda, Bricolage_Grotesque, DM_Mono, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { ReactLenis } from "lenis/react";
import { AnimateUIProvider } from "@animate-ui/react/provider";
import { ClickBurst } from "@/components/click-burst";
import { PixelPetIntro } from "@/components/pixel-pet-intro";
import { Sidebar, ThemeScript } from "@/components/sidebar";
import { INTRO, NAME, ROLE } from "@/lib/data";
import "./globals.css";
const sans = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const serif = Instrument_Serif({
  subsets: ["latin"],
  style: ["italic"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
});
const mono = DM_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono",
  display: "swap",
});
const display = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const sinistre = localFont({
  src: "./fonts/Sinistre-Bold.woff2",
  weight: "700",
  variable: "--font-sinistre",
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
      className={`${sans.variable} ${serif.variable} ${mono.variable} ${display.variable} ${sinistre.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <Script id="intro-bootstrap" strategy="beforeInteractive">
          {`(function(){try{var root=document.documentElement;if(window.location.pathname!=="/"){root.dataset.introMode="skip";return}var seen=window.sessionStorage.getItem("pet-intro-seen")==="1";var reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;root.dataset.introMode=!seen&&!reduced?"play":"skip"}catch(e){document.documentElement.dataset.introMode="play"}})();`}
        </Script>
        <AnimateUIProvider tempo={0.9}>
          <ReactLenis root options={{ stopInertiaOnNavigate: true }} />
          <ClickBurst />
          <div className="texture-layer" aria-hidden="true" />
          <div className="shell">
            <Sidebar />
            <main className="main">{children}</main>
          </div>
          <PixelPetIntro />
        </AnimateUIProvider>
      </body>
    </html>
  );
}
