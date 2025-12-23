import { LayoutDashboard } from "lucide-react";
import { IconShoppingCart, IconTrendingUp } from "@tabler/icons-react";
import { ReactNode } from "react";

export interface NavLink {
  label: string;
  href: string;
  icon: ReactNode;
  name?: string;
  description?: string;
  number?: number;
  indexEnabled?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  {
    label: "Dashboard",
    href: "/app/dashboard",
    icon: <LayoutDashboard className="h-5 w-5 shrink-0" />,
    description: "An overview of your usage in Artic",
  },
  {
    label: "Marketplace",
    href: "/app/marketplace",
    icon: <IconShoppingCart className="h-5 w-5 shrink-0" />,
    description: "Browse and purchase strategies",
  },
  {
    label: "Strategies",
    href: "/app/strategies",
    icon: <IconTrendingUp className="h-5 w-5 shrink-0" />,
    description: "Manage your active strategies",
  },
];

export const getLinkByUrl = (url: string): NavLink | undefined => {
  return NAV_LINKS.find((link) => link.href === url);
};

export const getLinkIndexByUrl = (url: string): number => {
  return NAV_LINKS.findIndex((link) => link.href === url);
};

export const generateTitleFromUrl = (url: string): string => {
  const segments = url.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] || "";

  return lastSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
