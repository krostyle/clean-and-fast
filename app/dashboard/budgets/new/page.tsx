import { prisma } from "@/lib/prisma";
import { BudgetForm } from "@/components/dashboard/BudgetForm";

export const dynamic = "force-dynamic";

export default async function NewBudgetPage() {
  const [clients, config] = await Promise.all([
    prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, company: true } }),
    prisma.companyConfig.findUnique({ where: { id: "singleton" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo presupuesto</h1>
        <p className="text-sm text-gray-500 mt-1">Crea un presupuesto para un cliente</p>
      </div>
      <BudgetForm clients={clients} taxRate={config?.taxRate.toNumber() ?? 19} />
    </div>
  );
}
