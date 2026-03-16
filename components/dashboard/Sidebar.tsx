"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  PaintbrushVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/dashboard/clients", label: "Clientes", icon: Users },
  { href: "/dashboard/budgets", label: "Presupuestos", icon: FileText },
  { href: "/dashboard/settings", label: "Configuración", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col bg-[var(--sidebar-bg)] text-[var(--sidebar-fg)]",
        "fixed inset-y-0 left-0 z-30 -translate-x-full transition-transform duration-300 ease-in-out",
        isOpen && "translate-x-0",
        "md:static md:translate-x-0 md:transition-none"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-[var(--sidebar-border)] px-6 py-5">
        <PaintbrushVertical className="h-7 w-7 text-blue-400" />
        <div>
          <p className="text-sm font-bold leading-none">Clean & Fast</p>
          <p className="text-xs text-slate-400 mt-0.5">Panel Administrativo</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-[var(--sidebar-accent)] hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--sidebar-border)] px-6 py-3">
        <p className="text-xs text-slate-500">Clean and Fast © 2026</p>
      </div>
    </aside>
  );
}
