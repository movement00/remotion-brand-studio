import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Remotion Brand Studio — AI Video Pipeline",
  description: "AI destekli marka video üretim platformu. Remotion ile profesyonel programatik video üretimi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Sidebar />
        <main className="ml-64 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
