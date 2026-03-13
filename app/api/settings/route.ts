import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { settingsSchema } from "@/lib/schemas";

export async function GET(_req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const config = await prisma.companyConfig.findUnique({ where: { id: "singleton" } });
  if (!config) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    ...config,
    taxRate: config.taxRate.toNumber(),
  });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Solo el propietario puede modificar la configuración" }, { status: 403 });
  }

  const body = await req.json();
  const result = settingsSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const config = await prisma.companyConfig.update({
    where: { id: "singleton" },
    data: {
      ...result.data,
      email: result.data.email || null,
    },
  });

  return NextResponse.json({ ...config, taxRate: config.taxRate.toNumber() });
}
