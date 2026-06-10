import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.eijex.com"),
  title: "eijex — Open tools for reproducible CDS design",
  description:
    "eijex builds open-source computational tools for reproducible plant CDS design and sequence review.",
  openGraph: {
    title: "eijex",
    description: "Open tools for reproducible plant CDS design.",
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
