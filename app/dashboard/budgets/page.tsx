import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText } from "lucide-react";
import { formatDate, formatCLP } from "@/lib/utils";
import { BudgetStatusBadge } from "@/components/dashboard/BudgetStatusBadge";
import { DeleteBudgetButton } from "@/components/dashboard/DeleteBudgetButton";

export const dynamic = "force-dynamic";

export default async function BudgetsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const { search = "", status = "", page = "1" } = await searchParams;
  const pageNum = parseInt(page);
  const pageSize = 20;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { number: { contains: search, mode: "insensitive" } },
      { client: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [budgets, total] = await Promise.all([
    prisma.budget.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      include: { client: { select: { id: true, name: true, company: true } } },
    }),
    prisma.budget.count({ where }),
  ]);

  const statuses = ["DRAFT", "SENT", "ACCEPTED", "REJECTED", "INVOICED"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Presupuestos</h1>
          <p className="text-sm text-gray-500 mt-1">{total} presupuesto{total !== 1 ? "s" : ""} en total</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/budgets/new">
            <Plus className="h-4 w-4" />
            Nuevo presupuesto
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <form method="get" className="flex gap-2">
          <input
            name="search"
            defaultValue={search}
            placeholder="Buscar por número o cliente..."
            className="flex h-10 w-64 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
          <select
            name="status"
            defaultValue={status}
            className="flex h-10 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          >
            <option value="">Todos los estados</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Lista de presupuestos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {budgets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-10 w-10 text-gray-300 mb-4" />
              <p className="text-gray-500">No hay presupuestos</p>
              <Button asChild className="mt-4" size="sm">
                <Link href="/dashboard/budgets/new">Crear primer presupuesto</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Número</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Cliente</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Estado</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">Total</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Creado</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(budgets as any[]).map((budget) => (
                    <tr key={budget.id} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium">
                        <Link href={`/dashboard/budgets/${budget.id}`} className="hover:text-blue-600">
                          {budget.number}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{budget.client.name}</p>
                          {budget.client.company && (
                            <p className="text-xs text-gray-500">{budget.client.company}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <BudgetStatusBadge status={budget.status} />
                      </td>
                      <td className="px-4 py-3 text-right font-medium">{formatCLP(budget.total.toNumber())}</td>
                      <td className="px-4 py-3 text-gray-500">{formatDate(budget.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/dashboard/budgets/${budget.id}`}>Ver</Link>
                          </Button>
                          <a
                            href={`/api/budgets/${budget.id}/pdf`}
                            target="_blank"
                            className="inline-flex items-center justify-center h-8 rounded-md border border-[var(--border)] bg-white px-3 text-xs font-medium hover:bg-slate-50 transition-colors"
                          >
                            PDF
                          </a>
                          <a
                            href={`/api/budgets/${budget.id}/excel`}
                            className="inline-flex items-center justify-center h-8 rounded-md border border-[var(--border)] bg-white px-3 text-xs font-medium hover:bg-slate-50 transition-colors"
                          >
                            Excel
                          </a>
                          <DeleteBudgetButton id={budget.id} number={budget.number} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
