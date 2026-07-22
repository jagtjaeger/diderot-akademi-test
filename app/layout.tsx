import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diderot Akademi – DILA Testapp",
  description:
    "Encyclopédie 2.0 – Kunskap som befriar. Intressebaserad AI-pedagogik med DILM och Curiosity Engine.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}
