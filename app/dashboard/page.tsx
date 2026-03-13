import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BudgetStatusBadge } from "@/components/dashboard/BudgetStatusBadge";
import { Users, FileText, TrendingUp, CheckCircle } from "lucide-react";
import { formatCLP, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [clientCount, budgetStats, recentBudgets, recentClients] = await Promise.all([
    prisma.client.count(),
    prisma.budget.groupBy({ by: ["status"], _count: { _all: true }, _sum: { total: true } }),
    prisma.budget.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { client: { select: { name: true } } },
    }),
    prisma.client.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { budgets: true } } },
    }),
  ]);

  const totalBudgets = budgetStats.reduce((s, g) => s + g._count._all, 0);
  const acceptedCount = budgetStats.find((g) => g.status === "ACCEPTED")?._count._all ?? 0;
  const totalRevenue = budgetStats
    .filter((g) => ["ACCEPTED", "INVOICED"].includes(g.status))
    .reduce((s, g) => s + (g._sum.total?.toNumber() ?? 0), 0);

  const stats = [
    { label: "Total clientes", value: clientCount, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Total presupuestos", value: totalBudgets, icon: FileText, color: "bg-purple-50 text-purple-600" },
    { label: "Presupuestos aceptados", value: acceptedCount, icon: CheckCircle, color: "bg-green-50 text-green-600" },
    { label: "Revenue (aceptado + facturado)", value: formatCLP(totalRevenue), icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel de control</h1>
        <p className="text-sm text-gray-500 mt-1">Resumen de tu negocio</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent budgets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Últimos presupuestos</CardTitle>
            <Link href="/dashboard/budgets" className="text-xs text-blue-600 hover:underline">
              Ver todos →
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentBudgets.length === 0 ? (
              <p className="p-6 text-sm text-gray-500">Sin presupuestos aún</p>
            ) : (
              <div className="divide-y">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(recentBudgets as any[]).map((b) => (
                  <div key={b.id} className="flex items-center justify-between px-6 py-3">
                    <div>
                      <Link href={`/dashboard/budgets/${b.id}`} className="text-sm font-mono font-medium hover:text-blue-600">
                        {b.number}
                      </Link>
                      <p className="text-xs text-gray-500">{b.client.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <BudgetStatusBadge status={b.status} />
                      <span className="text-sm font-medium">{formatCLP(b.total.toNumber())}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent clients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Últimos clientes</CardTitle>
            <Link href="/dashboard/clients" className="text-xs text-blue-600 hover:underline">
              Ver todos →
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentClients.length === 0 ? (
              <p className="p-6 text-sm text-gray-500">Sin clientes aún</p>
            ) : (
              <div className="divide-y">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(recentClients as any[]).map((c) => (
                  <div key={c.id} className="flex items-center justify-between px-6 py-3">
                    <div>
                      <Link href={`/dashboard/clients/${c.id}`} className="text-sm font-medium hover:text-blue-600">
                        {c.name}
                      </Link>
                      {c.company && <p className="text-xs text-gray-500">{c.company}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{c._count.budgets} presup.</Badge>
                      <span className="text-xs text-gray-400">{formatDate(c.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
