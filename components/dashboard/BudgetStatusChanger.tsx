"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const VALID_TRANSITIONS: Record<string, { status: string; label: string; variant?: "default" | "outline" | "destructive" | "secondary" }[]> = {
  DRAFT: [{ status: "SENT", label: "Marcar como Enviado" }],
  SENT: [
    { status: "ACCEPTED", label: "Aceptar" },
    { status: "REJECTED", label: "Rechazar", variant: "destructive" },
  ],
  REJECTED: [{ status: "DRAFT", label: "Volver a Borrador", variant: "outline" }],
  ACCEPTED: [{ status: "INVOICED", label: "Marcar como Facturado" }],
  INVOICED: [],
};

export function BudgetStatusChanger({ budgetId, currentStatus }: { budgetId: string; currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const transitions = VALID_TRANSITIONS[currentStatus] ?? [];

  if (transitions.length === 0) return null;

  const changeStatus = async (status: string) => {
    setLoading(true);
    const res = await fetch(`/api/budgets/${budgetId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);

    if (res.ok) {
      toast({ title: "Estado actualizado" });
      router.refresh();
    } else {
      const err = await res.json();
      toast({ title: "Error", description: err?.error, variant: "destructive" });
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {transitions.map((t) => (
        <Button
          key={t.status}
          variant={t.variant ?? "default"}
          size="sm"
          disabled={loading}
          onClick={() => changeStatus(t.status)}
        >
          {t.label}
        </Button>
      ))}
    </div>
  );
}
