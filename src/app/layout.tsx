import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SessionProvider } from "@/lib/session";
import TopBar from "@/components/TopBar";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "IBTSS 2026 AI Learning Passport — FHSU",
  description: "Workshop agenda, interactive participant toolkit, and digital stamp passport for the IBTSS 2026 pre-conference workshop.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased" style={{ fontFamily: "'Barlow', 'Avenir', Arial, sans-serif", background: "white" }}>
        <SessionProvider>
          <TopBar />
          <AppShell>{children}</AppShell>
        </SessionProvider>
      </body>
    </html>
  );
}
