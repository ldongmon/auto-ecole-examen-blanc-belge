import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Examen Blanc Belge — Permis B",
  description: "Simulateur d'examen théorique du permis B, fidèle au barème officiel belge.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
