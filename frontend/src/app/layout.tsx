import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "BGVerify.ai | Background Verification Platform",
  description: "Fast, reliable background checks for education, employment, and identity documents.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
