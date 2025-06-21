import type React from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import Header from "@/components/layout/header/header";

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
    <ClerkProvider>
      <html lang="es">
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased font-primary"
          )}
        >
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset>
              <Header />
              <div className="p-4 pt-0">{children}</div>
            </SidebarInset>
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
