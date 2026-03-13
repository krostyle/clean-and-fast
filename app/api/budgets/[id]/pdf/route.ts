export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BudgetPDFDocument } from "@/lib/pdf";
import type { DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const [budget, config] = await Promise.all([
    prisma.budget.findUnique({
      where: { id },
      include: {
        client: true,
        items: { orderBy: { order: "asc" } },
      },
    }),
    prisma.companyConfig.findUnique({ where: { id: "singleton" } }),
  ]);

  if (!budget) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const pdfBudget = {
    number: budget.number,
    status: budget.status,
    createdAt: budget.createdAt,
    validUntil: budget.validUntil,
    notes: budget.notes,
    subtotal: budget.subtotal.toNumber(),
    taxRate: budget.taxRate.toNumber(),
    taxAmount: budget.taxAmount.toNumber(),
    total: budget.total.toNumber(),
    client: {
      name: budget.client.name,
      company: budget.client.company,
      email: budget.client.email,
      phone: budget.client.phone,
      address: budget.client.address,
    },
    items: budget.items.map((i) => ({
      description: i.description,
      quantity: i.quantity.toNumber(),
      unitPrice: i.unitPrice.toNumber(),
      total: i.total.toNumber(),
    })),
  };

  const company = {
    name: config?.name ?? "Clean and Fast",
    taxId: config?.taxId,
    address: config?.address,
    phone: config?.phone,
    email: config?.email,
  };

  const element = React.createElement(
    BudgetPDFDocument,
    { budget: pdfBudget, company }
  ) as ReactElement<DocumentProps>;

  const buffer = await renderToBuffer(element);

  return new NextResponse(new Uint8Array(buffer as Buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${budget.number}.pdf"`,
    },
  });
}
