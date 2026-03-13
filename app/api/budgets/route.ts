import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { budgetSchema } from "@/lib/schemas";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1");
  const pageSize = 20;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { number: { contains: search, mode: "insensitive" } },
      { client: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [budgets, total] = await Promise.all([
    prisma.budget.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { client: { select: { id: true, name: true, company: true } } },
    }),
    prisma.budget.count({ where }),
  ]);

  return NextResponse.json({
    budgets: budgets.map((b) => ({
      ...b,
      subtotal: b.subtotal.toNumber(),
      taxAmount: b.taxAmount.toNumber(),
      total: b.total.toNumber(),
      taxRate: b.taxRate.toNumber(),
    })),
    total,
    page,
    pageSize,
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const result = budgetSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const { clientId, notes, validUntil, items } = result.data;

  // Get company config and generate number atomically
  const config = await prisma.$transaction(async (tx) => {
    return tx.companyConfig.update({
      where: { id: "singleton" },
      data: { nextSequence: { increment: 1 } },
    });
  });

  const seq = config.nextSequence - 1;
  const year = new Date().getFullYear();
  const number = `${config.budgetPrefix}-${year}-${String(seq).padStart(3, "0")}`;

  const taxRate = config.taxRate.toNumber();

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxAmount = Math.round(subtotal * (taxRate / 100));
  const total = subtotal + taxAmount;

  const budget = await prisma.budget.create({
    data: {
      number,
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

  return NextResponse.json(
    {
      ...budget,
      subtotal: budget.subtotal.toNumber(),
      taxAmount: budget.taxAmount.toNumber(),
      total: budget.total.toNumber(),
      taxRate: budget.taxRate.toNumber(),
    },
    { status: 201 }
  );
}
