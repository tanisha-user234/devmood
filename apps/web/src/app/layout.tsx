import type { Metadata } from "next";
import {Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";

const inter = Inter({subsets:["latin"]})

export const metadata: Metadata = {
  title: 'DevMood — Track your dev journey',
  description: 'Journal your coding sessions and discover your productivity patterns'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
