import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { budgetSchema, budgetStatusSchema } from "@/lib/schemas";

const VALID_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ["SENT"],
  SENT: ["ACCEPTED", "REJECTED"],
  REJECTED: ["DRAFT"],
  ACCEPTED: ["INVOICED"],
  INVOICED: [],
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const budget = await prisma.budget.findUnique({
    where: { id },
    include: {
      client: true,
      items: { orderBy: { order: "asc" } },
    },
  });
  if (!budget) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    ...budget,
    subtotal: budget.subtotal.toNumber(),
    taxAmount: budget.taxAmount.toNumber(),
    total: budget.total.toNumber(),
    taxRate: budget.taxRate.toNumber(),
    items: budget.items.map((i) => ({
      ...i,
      quantity: i.quantity.toNumber(),
      unitPrice: i.unitPrice.toNumber(),
      total: i.total.toNumber(),
    })),
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  // Status change only
  if (body.status && Object.keys(body).length === 1) {
    const statusResult = budgetStatusSchema.safeParse(body);
    if (!statusResult.success) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const current = await prisma.budget.findUnique({ where: { id }, select: { status: true } });
    if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const allowed = VALID_TRANSITIONS[current.status] ?? [];
    if (!allowed.includes(statusResult.data.status)) {
      return NextResponse.json(
        { error: `Transición no permitida: ${current.status} → ${statusResult.data.status}` },
        { status: 400 }
      );
    }

    const updated = await prisma.budget.update({
      where: { id },
      data: { status: statusResult.data.status },
    });
    return NextResponse.json({ ...updated, total: updated.total.toNumber() });
  }

  // Full update (only DRAFT)
  const current = await prisma.budget.findUnique({ where: { id }, select: { status: true } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (current.status !== "DRAFT") {
    return NextResponse.json({ error: "Solo se pueden editar presupuestos en borrador" }, { status: 400 });
  }

  const result = budgetSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const { clientId, notes, validUntil, items } = result.data;
  const config = await prisma.companyConfig.findUnique({ where: { id: "singleton" } });
  const taxRate = config?.taxRate.toNumber() ?? 19;

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxAmount = Math.round(subtotal * (taxRate / 100));
  const total = subtotal + taxAmount;

  // Delete existing items and recreate
  await prisma.budgetItem.deleteMany({ where: { budgetId: id } });
  const budget = await prisma.budget.update({
    where: { id },
    data: {
      clientId,
      notes: notes || null,
      validUntil: validUntil ? new Date(validUntil) : null,
      subtotal,
      taxRate,
      taxAmount,
      total,
      items: {
        create: items.map((item, idx) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
          order: idx,
        })),
      },
    },
    include: { items: true, client: true },
  });

  return NextResponse.json({
    ...budget,
    subtotal: budget.subtotal.toNumber(),
    taxAmount: budget.taxAmount.toNumber(),
    total: budget.total.toNumber(),
    taxRate: budget.taxRate.toNumber(),
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.budget.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
