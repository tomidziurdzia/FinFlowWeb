import type React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full antialiased font-primary">
      {children}
    </div>
  );
}
