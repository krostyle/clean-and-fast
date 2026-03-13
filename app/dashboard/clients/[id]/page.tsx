import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClientForm } from "@/components/dashboard/ClientForm";

export const dynamic = "force-dynamic";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Editar cliente</h1>
        <p className="text-sm text-gray-500 mt-1">{client.name}</p>
      </div>
      <ClientForm
        initialData={{
          id: client.id,
          name: client.name,
          company: client.company ?? undefined,
          email: client.email ?? undefined,
          phone: client.phone ?? undefined,
          address: client.address ?? undefined,
          notes: client.notes ?? undefined,
        }}
      />
    </div>
  );
}
