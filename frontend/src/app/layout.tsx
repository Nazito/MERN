import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import StoreProvider from "@/components/providers/StoreProvider";
import ThemeRegistry from "@/components/providers/ThemeRegistry";
import AppShell from "@/components/layout/AppShell";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "Circle",
  description: "Circle social network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${fraunces.variable}`}>
        <StoreProvider>
          <ThemeRegistry>
            <AppShell>{children}</AppShell>
          </ThemeRegistry>
        </StoreProvider>
      </body>
    </html>
  );
}
