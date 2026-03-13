import { Badge } from "@/components/ui/badge";

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" | "info" | "outline" }> = {
  DRAFT: { label: "Borrador", variant: "secondary" },
  SENT: { label: "Enviado", variant: "info" },
  ACCEPTED: { label: "Aceptado", variant: "success" },
  REJECTED: { label: "Rechazado", variant: "destructive" },
  INVOICED: { label: "Facturado", variant: "default" },
};

export function BudgetStatusBadge({ status }: { status: string }) {
  const { label, variant } = STATUS_MAP[status] ?? { label: status, variant: "outline" };
  return <Badge variant={variant}>{label}</Badge>;
}
