import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Convert",
  description: "Convertisseur hexadécimal et décimal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
