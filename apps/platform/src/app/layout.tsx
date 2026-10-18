import type { Metadata } from "next";
import { PlatformFrame } from "@/components/platform-frame";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Gen-Z | Wallet sign-in", template: "%s | Gen-Z" },
  description: "Sign in to Gen-Z with your EVM wallet on Base Sepolia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className="flex min-h-svh flex-col">
        <a
          href="#main-content"
          className="sr-only z-50 rounded-md bg-foreground p-3 text-background focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <PlatformFrame>{children}</PlatformFrame>
      </body>
    </html>
  );
}
