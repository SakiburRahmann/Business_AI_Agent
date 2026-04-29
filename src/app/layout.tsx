import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "North South Dental | Comprehensive Dental Care",
  description: "North South Dental provides quality dental care including general dentistry, cosmetic procedures, orthodontics, and emergency services. Serving patients of all ages.",
  keywords: ["Dental", "Dentist", "North South Dental", "Dental Care", "Teeth Cleaning", "Dental Implants"],
  authors: [{ name: "North South Dental" }],
  openGraph: {
    title: "North South Dental",
    description: "Comprehensive Dental Care for Patients of All Ages",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
