import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  company: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export type ClientInput = z.infer<typeof clientSchema>;

const numberFromInput = z.preprocess(
  (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
  z.number()
);

export const budgetItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, "Descripción requerida"),
  quantity: numberFromInput.pipe(z.number().positive("Debe ser mayor a 0")),
  unitPrice: numberFromInput.pipe(z.number().nonnegative("Debe ser 0 o mayor")),
  total: z.number().optional(),
  order: z.number().optional(),
});

export const budgetSchema = z.object({
  clientId: z.string().min(1, "Cliente requerido"),
  notes: z.string().optional(),
  validUntil: z.string().optional(),
  items: z.array(budgetItemSchema).min(1, "Agrega al menos un ítem"),
});

export type BudgetInput = z.infer<typeof budgetSchema>;

export const budgetStatusSchema = z.object({
  status: z.enum(["DRAFT", "SENT", "ACCEPTED", "REJECTED", "INVOICED"]),
});

export const settingsSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  taxId: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  budgetPrefix: z.string().min(1, "Prefijo requerido"),
  taxRate: numberFromInput.pipe(z.number().min(0).max(100)),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
