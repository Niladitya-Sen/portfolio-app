import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Portfolio App",
  description: "A portfolio app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${inter.variable} antialiased`}
      >
        <NextTopLoader color="#3a72ec" showSpinner={false} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
