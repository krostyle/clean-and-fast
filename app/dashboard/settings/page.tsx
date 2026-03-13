import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/dashboard/SettingsForm";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [config, session] = await Promise.all([
    prisma.companyConfig.findUnique({ where: { id: "singleton" } }),
    auth(),
  ]);

  if (!config) return <p>Error cargando configuración</p>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración de empresa</h1>
        <p className="text-sm text-gray-500 mt-1">
          {session?.user.role !== "OWNER"
            ? "Solo el propietario puede editar esta configuración"
            : "Actualiza los datos de tu empresa"}
        </p>
      </div>
      <SettingsForm
        initialData={{
          name: config.name,
          taxId: config.taxId ?? undefined,
          address: config.address ?? undefined,
          phone: config.phone ?? undefined,
          email: config.email ?? undefined,
          budgetPrefix: config.budgetPrefix,
          taxRate: config.taxRate.toNumber(),
        }}
        isOwner={session?.user.role === "OWNER"}
      />
    </div>
  );
}
