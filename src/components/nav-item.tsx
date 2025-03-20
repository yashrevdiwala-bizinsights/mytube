import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router";

interface NavItemProps {
  label: string;
  icon: LucideIcon;
  path: string;
  isOpen?: boolean;
  isActive?: boolean;
}

export const NavItem = ({
  path,
  label,
  icon: Icon,
  isOpen,
  isActive,
}: NavItemProps) => {
  return (
    <>
      <Link
        to={path}
        className={cn(
          "flex items-center gap-2 hover:text-gray-400 hover:bg-[#1d2838]/80 rounded-md p-2",
          isActive && "bg-[#1d2838]/80"
        )}
      >
        <Icon className="w-5 h-5" /> {isOpen && label}
      </Link>
    </>
  );
};
