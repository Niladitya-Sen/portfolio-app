import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';

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
      <NextTopLoader color="#3a72ec" showSpinner={false} />
      <body
        className={`${inter.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
