import type { Metadata } from "next";
import "./globals.css";
import { BootLoader } from "../components/BootLoader";

import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Aetheris AI — The Operating System for Artificial Intelligence",
  description: "No-code AI training platform. Train, Monitor, Optimize, Deploy.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} dark`}>
      <body style={{ fontFamily: "var(--font-sans)" }}>
        <BootLoader />
        {children}
      </body>
    </html>
  );
}
