import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetStatusBadge } from "@/components/dashboard/BudgetStatusBadge";
import { BudgetStatusChanger } from "@/components/dashboard/BudgetStatusChanger";
import { DuplicateBudgetButton } from "@/components/dashboard/DuplicateBudgetButton";
import { formatCLP, formatDate } from "@/lib/utils";
import { ArrowLeft, Download, Edit } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BudgetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const budget = await prisma.budget.findUnique({
    where: { id },
    include: {
      client: true,
      items: { orderBy: { order: "asc" } },
    },
  });

  if (!budget) notFound();

  const subtotal = budget.subtotal.toNumber();
  const taxAmount = budget.taxAmount.toNumber();
  const total = budget.total.toNumber();
  const taxRate = budget.taxRate.toNumber();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/budgets">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-mono">{budget.number}</h1>
            <BudgetStatusBadge status={budget.status} />
          </div>
          <p className="text-sm text-gray-500 mt-0.5">Creado el {formatDate(budget.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {budget.status === "DRAFT" && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/budgets/${id}/edit`}>
                <Edit className="h-4 w-4" />
                Editar
              </Link>
            </Button>
          )}
          <DuplicateBudgetButton budgetId={id} />
          <a
            href={`/api/budgets/${id}/pdf`}
            target="_blank"
            className="inline-flex items-center gap-1.5 h-8 rounded-md border border-[var(--border)] bg-white px-3 text-xs font-medium hover:bg-slate-50 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            PDF
          </a>
          <a
            href={`/api/budgets/${id}/excel`}
            className="inline-flex items-center gap-1.5 h-8 rounded-md border border-[var(--border)] bg-white px-3 text-xs font-medium hover:bg-slate-50 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Excel
          </a>
        </div>
      </div>

      {/* Status changer */}
      <BudgetStatusChanger budgetId={id} currentStatus={budget.status} />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Client info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium text-gray-900">{budget.client.name}</p>
            {budget.client.company && <p className="text-gray-600">{budget.client.company}</p>}
            {budget.client.email && <p className="text-gray-600">{budget.client.email}</p>}
            {budget.client.phone && <p className="text-gray-600">{budget.client.phone}</p>}
            {budget.client.address && <p className="text-gray-600">{budget.client.address}</p>}
          </CardContent>
        </Card>

        {/* Budget info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Información</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {budget.validUntil && (
              <div className="flex justify-between">
                <span className="text-gray-600">Válido hasta</span>
                <span>{formatDate(budget.validUntil)}</span>
              </div>
            )}
            {budget.notes && (
              <div>
                <p className="text-gray-600 mb-1">Notas</p>
                <p className="text-gray-800">{budget.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ítems</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Descripción</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Cantidad</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">P. Unitario</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Total</th>
              </tr>
            </thead>
            <tbody>
              {budget.items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3">{item.description}</td>
                  <td className="px-4 py-3 text-right">{item.quantity.toNumber()}</td>
                  <td className="px-4 py-3 text-right">{formatCLP(item.unitPrice.toNumber())}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCLP(item.total.toNumber())}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t bg-slate-50">
              <tr>
                <td colSpan={3} className="px-4 py-2 text-right text-sm text-gray-600">Subtotal</td>
                <td className="px-4 py-2 text-right font-medium">{formatCLP(subtotal)}</td>
              </tr>
              <tr>
                <td colSpan={3} className="px-4 py-2 text-right text-sm text-gray-600">IVA ({taxRate}%)</td>
                <td className="px-4 py-2 text-right font-medium">{formatCLP(taxAmount)}</td>
              </tr>
              <tr className="border-t">
                <td colSpan={3} className="px-4 py-3 text-right font-bold">Total</td>
                <td className="px-4 py-3 text-right font-bold text-lg">{formatCLP(total)}</td>
              </tr>
            </tfoot>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
