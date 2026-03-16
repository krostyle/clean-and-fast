"use client";

import { signOut } from "next-auth/react";
import { LogOut, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardNavProps {
  userName: string;
  userRole: string;
  onMenuToggle: () => void;
}

export function DashboardNav({ userName, userRole, onMenuToggle }: DashboardNavProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--border)] bg-white px-6">
      <button
        onClick={onMenuToggle}
        className="rounded-md p-2 text-[var(--muted-foreground)] hover:bg-[var(--accent)] md:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-[var(--muted-foreground)]" />
          <span className="font-medium">{userName}</span>
          <span className="text-[var(--muted-foreground)] text-xs">({userRole})</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Salir
        </Button>
      </div>
    </header>
  );
}
