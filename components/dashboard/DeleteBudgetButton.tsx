"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

export function DeleteBudgetButton({ id, number }: { id: string; number: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar presupuesto "${number}"?`)) return;
    setLoading(true);
    const res = await fetch(`/api/budgets/${id}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      toast({ title: "Presupuesto eliminado" });
      router.refresh();
    } else {
      toast({ title: "Error al eliminar", variant: "destructive" });
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleDelete} disabled={loading} className="text-red-600 hover:text-red-700 hover:border-red-300">
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  );
}
