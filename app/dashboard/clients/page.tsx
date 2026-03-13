import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { DeleteClientButton } from "@/components/dashboard/DeleteClientButton";

export const dynamic = "force-dynamic";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { search = "", page = "1" } = await searchParams;
  const pageNum = parseInt(page);
  const pageSize = 20;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { company: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      include: { _count: { select: { budgets: true } } },
    }),
    prisma.client.count({ where }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-500 mt-1">{total} cliente{total !== 1 ? "s" : ""} en total</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/clients/new">
            <Plus className="h-4 w-4" />
            Nuevo cliente
          </Link>
        </Button>
      </div>

      {/* Search */}
      <form method="get">
        <input
          name="search"
          defaultValue={search}
          placeholder="Buscar por nombre, empresa o email..."
          className="flex h-10 w-full max-w-sm rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        />
      </form>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" />
            Lista de clientes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="h-10 w-10 text-gray-300 mb-4" />
              <p className="text-gray-500">No hay clientes registrados</p>
              <Button asChild className="mt-4" size="sm">
                <Link href="/dashboard/clients/new">Crear primer cliente</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Nombre</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Empresa</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Teléfono</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Presupuestos</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Creado</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium">
                        <Link href={`/dashboard/clients/${client.id}`} className="hover:text-blue-600">
                          {client.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{client.company ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{client.email ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{client.phone ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{client._count.budgets}</td>
                      <td className="px-4 py-3 text-gray-500">{formatDate(client.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/dashboard/clients/${client.id}`}>Editar</Link>
                          </Button>
                          <DeleteClientButton id={client.id} name={client.name} />
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
