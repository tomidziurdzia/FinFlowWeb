"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Receipt,
  Tags,
  BarChart3,
  Settings,
  DollarSign,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/app", icon: LayoutDashboard },
  { name: "Gastos", href: "/app/expenses", icon: Receipt },
  { name: "Categorías", href: "/app/categories", icon: Tags },
  { name: "Reportes", href: "/app/reports", icon: BarChart3 },
  { name: "Configuración", href: "/app/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-sm border-r min-h-screen">
      <div className="p-6">
        <Link href="/app" className="flex items-center">
          <DollarSign className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">
            ExpenseFlow
          </span>
        </Link>
      </div>

      <nav className="px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
