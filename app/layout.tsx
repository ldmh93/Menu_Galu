import type { Metadata, Viewport } from "next";
import { Fredoka, Poppins } from "next/font/google";

import { site } from "@/config/site";
import "@/styles/globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.brand} · ${site.subtitle}`,
  description: `Menú digital de ${site.brand}: bobas, frozen yogurt, ice rollers, malteadas y postres.`,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#fff5f5",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${fredoka.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}
