import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "OmniiChat 1.0 | Pure Intelligence",
  description: "Experience the next generation of AI conversational architecture. Sub-100ms streaming latency, high-fidelity design.",
  keywords: ["AI", "Chat", "OmniiChat", "Gemini", "Next.js", "Sakibur Rahman"],
  authors: [{ name: "Sakibur Rahman" }],
  openGraph: {
    title: "OmniiChat 1.0",
    description: "AI Conversational Masterpiece",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#020202",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-[#020202] text-zinc-100 selection:bg-purple-500/30 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
