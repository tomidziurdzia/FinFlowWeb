import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  icons: {
    icon: "/logo.png",
  },
  title: "FinFlow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#3b82f6",
        },
      }}
    >
      <html lang="es">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
