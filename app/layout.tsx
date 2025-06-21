import type React from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { cn } from "@/lib/utils";

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
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased font-primary"
          )}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
