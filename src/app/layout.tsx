import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.eijex.com"),
  title: "eijex — Reproducible infrastructure for plant molecular expression",
  description:
    "eijex builds evidence-linked research software for plant molecular expression, starting with open-source, constraint-aware CDS design through FactorForge.",
  openGraph: {
    title: "eijex",
    description:
      "Reproducible, evidence-linked research software for plant molecular expression.",
    url: "https://www.eijex.com",
    siteName: "eijex",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
