import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const original = await prisma.budget.findUnique({
    where: { id },
    include: { items: { orderBy: { order: "asc" } } },
  });
  if (!original) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Generate new number atomically
  const config = await prisma.$transaction(async (tx) => {
    return tx.companyConfig.update({
      where: { id: "singleton" },
      data: { nextSequence: { increment: 1 } },
    });
  });

  const seq = config.nextSequence - 1;
  const year = new Date().getFullYear();
  const number = `${config.budgetPrefix}-${year}-${String(seq).padStart(3, "0")}`;

  const newBudget = await prisma.budget.create({
    data: {
      number,
      clientId: original.clientId,
      status: "DRAFT",
      notes: original.notes,
      validUntil: original.validUntil,
      subtotal: original.subtotal,
      taxRate: original.taxRate,
      taxAmount: original.taxAmount,
      total: original.total,
      items: {
        create: original.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
          order: item.order,
        })),
      },
    },
  });

  return NextResponse.json({ id: newBudget.id, number: newBudget.number }, { status: 201 });
}
