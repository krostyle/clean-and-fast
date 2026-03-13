import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BudgetForm } from "@/components/dashboard/BudgetForm";

export const dynamic = "force-dynamic";

export default async function EditBudgetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [budget, clients, config] = await Promise.all([
    prisma.budget.findUnique({
      where: { id },
      include: { items: { orderBy: { order: "asc" } } },
    }),
    prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, company: true } }),
    prisma.companyConfig.findUnique({ where: { id: "singleton" } }),
  ]);

  if (!budget) notFound();
  if (budget.status !== "DRAFT") {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Solo se pueden editar presupuestos en borrador.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Editar presupuesto</h1>
        <p className="text-sm text-gray-500 font-mono mt-1">{budget.number}</p>
      </div>
      <BudgetForm
        clients={clients}
        taxRate={config?.taxRate.toNumber() ?? 19}
        initialData={{
          id: budget.id,
          clientId: budget.clientId,
          notes: budget.notes ?? undefined,
          validUntil: budget.validUntil?.toISOString().split("T")[0] ?? undefined,
          items: budget.items.map((item) => ({
            id: item.id,
            description: item.description,
            quantity: item.quantity.toNumber(),
            unitPrice: item.unitPrice.toNumber(),
            total: item.total.toNumber(),
            order: item.order,
          })),
        }}
      />
    </div>
  );
}
