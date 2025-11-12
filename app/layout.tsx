import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import { SessionWrapper } from "./session-provider";
import Navbar from "@/components/Navbar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Green Hub Shop",
  description: "ร้านค้าออนไลน์เพื่อคนรักษ์โลก 🌿",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-emerald-50 via-green-50 to-lime-100 text-green-900`}
      >
        <SessionWrapper>
          <Navbar />
          <main className="pt-20">{children}</main>
        </SessionWrapper>
      </body>
    </html>
  );
}
