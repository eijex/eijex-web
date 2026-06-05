import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.eijex.com"),
  title: "eijex — Open tools for plant synthetic biology",
  description:
    "eijex builds open-source computational tools for plant synthetic biology — peer-reviewed, reproducible, and freely available to the research community.",
  openGraph: {
    title: "eijex",
    description: "Open tools for plant synthetic biology.",
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
