import { useState } from "react"
import { useLocation } from "react-router"
import { Home, Library, LucideIcon, Menu, Video } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { NavItem } from "./nav-item"

interface SidebarRoute {
  path: string
  label: string
  icon: LucideIcon
}

const routes: SidebarRoute[] = [
  {
    path: "/",
    label: "Home",
    icon: Home,
  },
  {
    path: "/subscriptions",
    label: "Subscriptions",
    icon: Video,
  },
  {
    path: "/library",
    label: "Library",
    icon: Library,
  },
]

export const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = useLocation().pathname

  return (
    <aside
      className={cn(
        sidebarOpen ? "w-60" : "w-20 items-center",
        "bg-gray-900 text-white transition-all duration-300 p-4 flex flex-col gap-6"
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
  )
}
