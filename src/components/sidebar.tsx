import { useState } from "react";
import { useLocation } from "react-router";
import { Home, LucideIcon, Menu, Upload } from "lucide-react";

import { cn } from "@/lib/utils";
import { NavItem } from "./nav-item";
import { Button } from "./ui/button";

interface SidebarRoute {
  path: string;
  label: string;
  icon: LucideIcon;
}

const routes: SidebarRoute[] = [
  {
    path: "/",
    label: "Home",
    icon: Home,
  },
  {
    path: "/upload",
    label: "Upload",
    icon: Upload,
  },
];

export const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = useLocation().pathname;

  return (
    <aside
      className={cn(
        sidebarOpen ? "w-60" : "w-20 items-center",
        "bg-gray-900 text-white transition-all duration-300 p-4 flex flex-col gap-6 fixed top-0 left-0 h-full pt-20"
      )}
    >
      <Button
        variant="ghost"
        className="w-fit self-end"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="w-6 h-6" />
      </Button>

      <nav className="flex flex-col gap-2">
        {routes.map((route, i) => (
          <NavItem
            key={i}
            path={route.path}
            label={route.label}
            icon={route.icon}
            isOpen={sidebarOpen}
            isActive={pathname === route.path}
          />
        ))}
      </nav>
    </aside>
  );
};
