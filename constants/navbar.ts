import { NavItem } from "@/interfaces/sidebar.interface";

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: "dashboard",
    isActive: false,
    shortcut: ["d", "d"],
    items: [],
  },
  {
    title: "Categories",
    url: "/categories",
    icon: "folder",
    isActive: false,
    shortcut: ["t", "t"],
    items: [],
  },
  {
    title: "Wallets",
    url: "/wallets",
    icon: "wallet",
    isActive: false,
    shortcut: ["e", "e"],
    items: [],
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: "arrowLeftRight",
    isActive: true,
    items: [],
  },
];
