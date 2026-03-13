import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  const companyName = config?.name ?? "Clean and Fast";

  const headerRows = [
    [companyName, "", "", ""],
    [`Presupuesto: ${budget.number}`, "", "", ""],
    [`Cliente: ${budget.client.name}`, "", "", ""],
    [`Empresa: ${budget.client.company ?? ""}`, "", "", ""],
    [`Fecha: ${new Intl.DateTimeFormat("es-CL").format(budget.createdAt)}`, "", "", ""],
    ["", "", "", ""],
    ["Descripción", "Cantidad", "Precio Unitario (CLP)", "Total (CLP)"],
  ];

  const itemRows = budget.items.map((item) => [
    item.description,
    item.quantity.toNumber(),
    item.unitPrice.toNumber(),
    item.total.toNumber(),
  ]);

  const subtotal = budget.subtotal.toNumber();
  const taxRate = budget.taxRate.toNumber();
  const taxAmount = budget.taxAmount.toNumber();
  const total = budget.total.toNumber();

  const totalsRows = [
    ["", "", "Subtotal", subtotal],
    ["", "", `IVA (${taxRate}%)`, taxAmount],
    ["", "", "TOTAL", total],
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([...headerRows, ...itemRows, ["", "", "", ""], ...totalsRows]);

  ws["!cols"] = [{ wch: 45 }, { wch: 12 }, { wch: 22 }, { wch: 18 }];

  // Style the header row (row 7, 0-indexed = 6)
  const headerRowIdx = 6;
  ["A", "B", "C", "D"].forEach((col) => {
    const cell = ws[`${col}${headerRowIdx + 1}`];
    if (cell) {
      cell.s = { font: { bold: true }, fill: { fgColor: { rgb: "1D4ED8" } } };
    }
  });

  XLSX.utils.book_append_sheet(wb, ws, "Presupuesto");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${budget.number}.xlsx"`,
    },
  });
}
