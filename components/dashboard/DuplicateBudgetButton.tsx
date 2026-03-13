"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function DuplicateBudgetButton({ budgetId }: { budgetId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const duplicate = async () => {
    setLoading(true);
    const res = await fetch(`/api/budgets/${budgetId}/duplicate`, { method: "POST" });
    setLoading(false);

    if (res.ok) {
      const data = await res.json();
      toast({ title: `Duplicado como ${data.number}` });
      router.push(`/dashboard/budgets/${data.id}`);
      router.refresh();
    } else {
      toast({ title: "Error al duplicar", variant: "destructive" });
    }
  };

  return (
    <Button variant="outline" size="sm" disabled={loading} onClick={duplicate}>
      <Copy className="h-4 w-4" />
      Duplicar
    </Button>
  );
}
