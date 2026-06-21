import type { Metadata } from "next";
import { Inter, Zen_Dots } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/lenis-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const zenDots = Zen_Dots({ weight: "400", subsets: ["latin"], variable: "--font-zen-dots" });

export const metadata: Metadata = {
  title: "PRism — AI Code Review for Engineering Teams",
  description:
    "PRism detects bugs, security vulnerabilities, performance bottlenecks, and code smells in your pull requests automatically using AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${zenDots.variable} font-sans antialiased overflow-x-clip`}>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
