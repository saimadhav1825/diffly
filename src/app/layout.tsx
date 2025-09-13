import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Diffly - Next-Gen Diff Checker",
  description: "Compare text, code, files, and folders with our modern, feature-rich diff checker. Fast, accurate, and beautifully designed.",
  keywords: ["diff checker", "text comparison", "code diff", "file comparison", "folder diff"],
  authors: [{ name: "Diffly Team" }],
  openGraph: {
    title: "Diffly - Next-Gen Diff Checker",
    description: "Compare text, code, files, and folders with our modern, feature-rich diff checker.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider
          defaultTheme="system"
          storageKey="diffly-ui-theme"
        >
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
