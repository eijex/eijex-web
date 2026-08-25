import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.eijex.com"),
  title: "eijex — Open evidence infrastructure for plant expression",
  description:
    "Open-source software for reproducible plant CDS design, human-supervised workflow governance, and evidence traceability.",
  openGraph: {
    title: "eijex — Design, govern, and preserve evidence",
    description:
      "Open-source research software connecting reproducible plant CDS design with reviewable evidence infrastructure.",
    url: "https://www.eijex.com",
    siteName: "eijex",
  },
  twitter: {
    card: "summary_large_image",
    title: "eijex — Design, govern, and preserve evidence",
    description:
      "Open-source research software for plant bio-design, workflow governance, and evidence traceability.",
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
