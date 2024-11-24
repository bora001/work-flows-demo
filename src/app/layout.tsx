import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Side from "@/components/@Side/Side";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Work-flows",
  description: "Work-flows-demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}
      >
        <Side />
        <div className="w-screen">{children}</div>
      </body>
    </html>
  );
}
