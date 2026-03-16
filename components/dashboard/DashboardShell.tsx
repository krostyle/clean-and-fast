"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

interface DashboardShellProps {
  userName: string;
  userRole: string;
  children: React.ReactNode;
}

export function DashboardShell({ userName, userRole, children }: DashboardShellProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--muted)]">
      {/* Overlay backdrop en móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardNav
          userName={userName}
          userRole={userRole}
          onMenuToggle={() => setIsOpen((prev) => !prev)}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
