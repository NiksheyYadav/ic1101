import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "../components/sidebar";

export const metadata: Metadata = {
  title: "Aetheris AI — The Operating System for Artificial Intelligence",
  description: "No-code AI training platform. Train, Monitor, Optimize, Deploy.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
