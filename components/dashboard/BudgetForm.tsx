"use client";

import { useForm, useFieldArray, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { budgetSchema, type BudgetInput } from "@/lib/schemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { formatCLP } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  company?: string | null;
}

interface BudgetFormProps {
  clients: Client[];
  taxRate: number;
  initialData?: BudgetInput & { id?: string };
}

export function BudgetForm({ clients, taxRate, initialData }: BudgetFormProps) {
  const router = useRouter();
  const isEdit = !!initialData?.id;

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BudgetInput>({
    resolver: zodResolver(budgetSchema) as Resolver<BudgetInput>,
    defaultValues: initialData ?? {
      clientId: "",
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const watchedItems = useWatch({ control, name: "items" });

  const { subtotal, taxAmount, total } = useMemo(() => {
    const sub = (watchedItems ?? []).reduce(
      (sum, item) => sum + (Number(item?.quantity) || 0) * (Number(item?.unitPrice) || 0),
      0
    );
    const tax = Math.round(sub * (taxRate / 100));
    return { subtotal: sub, taxAmount: tax, total: sub + tax };
  }, [watchedItems, taxRate]);

  const onSubmit = async (data: BudgetInput) => {
    const url = isEdit ? `/api/budgets/${initialData!.id}` : "/api/budgets";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      toast({ title: "Error", description: err?.error ?? "No se pudo guardar", variant: "destructive" });
      return;
    }

    toast({ title: isEdit ? "Presupuesto actualizado" : "Presupuesto creado" });
    router.push("/dashboard/budgets");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
      {/* Client + dates */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Cliente *</Label>
          <Select
            defaultValue={initialData?.clientId ?? ""}
            onValueChange={(v) => setValue("clientId", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar cliente..." />
            </SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}{c.company ? ` — ${c.company}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.clientId && <p className="text-xs text-red-600">{errors.clientId.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="validUntil">Válido hasta</Label>
          <Input id="validUntil" type="date" {...register("validUntil")} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="notes">Notas</Label>
          <Textarea id="notes" {...register("notes")} rows={2} />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Ítems</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ description: "", quantity: 1, unitPrice: 0 })}
          >
            <Plus className="h-4 w-4" />
            Agregar ítem
          </Button>
        </div>

        {errors.items && typeof errors.items === "object" && "message" in errors.items && (
          <p className="text-xs text-red-600">{(errors.items as { message?: string }).message}</p>
        )}

        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-600">Descripción</th>
                <th className="px-3 py-2 text-right font-medium text-gray-600 w-24">Cantidad</th>
                <th className="px-3 py-2 text-right font-medium text-gray-600 w-32">P. Unitario</th>
                <th className="px-3 py-2 text-right font-medium text-gray-600 w-32">Total</th>
                <th className="px-3 py-2 w-10" />
              </tr>
            </thead>
            <tbody>
              {fields.map((field, idx) => {
                const qty = Number(watchedItems?.[idx]?.quantity) || 0;
                const price = Number(watchedItems?.[idx]?.unitPrice) || 0;
                const lineTotal = qty * price;
                return (
                  <tr key={field.id} className="border-t">
                    <td className="px-2 py-2">
                      <Input
                        {...register(`items.${idx}.description`)}
                        placeholder="Descripción del servicio"
                        className="border-0 shadow-none focus-visible:ring-0 px-1"
                      />
                      {errors.items?.[idx]?.description && (
                        <p className="text-xs text-red-600 px-1">
                          {errors.items[idx]?.description?.message}
                        </p>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      <Input
                        {...register(`items.${idx}.quantity`)}
                        type="number"
                        step="0.01"
                        min="0"
                        className="border-0 shadow-none focus-visible:ring-0 px-1 text-right"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <Input
                        {...register(`items.${idx}.unitPrice`)}
                        type="number"
                        step="1"
                        min="0"
                        className="border-0 shadow-none focus-visible:ring-0 px-1 text-right"
                      />
                    </td>
                    <td className="px-3 py-2 text-right text-gray-700 font-medium">
                      {formatCLP(lineTotal)}
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        disabled={fields.length === 1}
                        className="text-gray-400 hover:text-red-500 disabled:opacity-30 p-1 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64 space-y-2 rounded-lg border bg-slate-50 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatCLP(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">IVA ({taxRate}%)</span>
            <span className="font-medium">{formatCLP(taxAmount)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 text-base font-bold">
            <span>Total</span>
            <span>{formatCLP(total)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : isEdit ? "Actualizar presupuesto" : "Crear presupuesto"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
