import { ClientForm } from "@/components/dashboard/ClientForm";

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo cliente</h1>
        <p className="text-sm text-gray-500 mt-1">Registra un nuevo cliente en el sistema</p>
      </div>
      <ClientForm />
    </div>
  );
}
