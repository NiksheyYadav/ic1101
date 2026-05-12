import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Aetheris Studio",
  description: "No-code AI training platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
