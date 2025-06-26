"use client";

import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { navItems } from "@/constants/navbar";
import { NavMain } from "@/components/layout/sidebar/nav-main";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 py-2 text-sidebar-accent-foreground">
          <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
            <Image
              src="/logo.png"
              width={675}
              height={900}
              alt="Login image"
              className="h-full w-full object-cover rounded-full"
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">FinFlow</span>
            <span className="truncate text-xs">Finanzas Personales</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        <NavMain items={navItems} />
      </SidebarContent>
    </Sidebar>
  );
}
