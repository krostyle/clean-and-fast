"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema, type SettingsInput } from "@/lib/schemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface SettingsFormProps {
  initialData: SettingsInput;
  isOwner: boolean;
}

export function SettingsForm({ initialData, isOwner }: SettingsFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema) as Resolver<SettingsInput>,
    defaultValues: initialData,
  });

  const onSubmit = async (data: SettingsInput) => {
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      toast({ title: "Error", description: err?.error ?? "No se pudo guardar", variant: "destructive" });
      return;
    }

    toast({ title: "Configuración guardada" });
    router.refresh();
  };

  const fields: { name: keyof SettingsInput; label: string; type?: string; placeholder?: string }[] = [
    { name: "name", label: "Nombre de la empresa *", placeholder: "Clean and Fast" },
    { name: "taxId", label: "RUT", placeholder: "12.345.678-9" },
    { name: "address", label: "Dirección", placeholder: "Av. Principal 123, Santiago" },
    { name: "phone", label: "Teléfono", placeholder: "+56 9 1234 5678" },
    { name: "email", label: "Email de contacto", type: "email", placeholder: "contacto@empresa.cl" },
    { name: "budgetPrefix", label: "Prefijo de presupuestos *", placeholder: "PRES" },
    { name: "taxRate", label: "IVA (%)", type: "number", placeholder: "19" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={`space-y-2 ${f.name === "name" || f.name === "address" ? "sm:col-span-2" : ""}`}>
            <Label htmlFor={f.name}>{f.label}</Label>
            <Input
              id={f.name}
              type={f.type ?? "text"}
              placeholder={f.placeholder}
              disabled={!isOwner}
              {...register(f.name)}
            />
            {errors[f.name] && <p className="text-xs text-red-600">{errors[f.name]?.message}</p>}
          </div>
        ))}
      </div>
      {isOwner && (
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar configuración"}
        </Button>
      )}
    </form>
  );
}
