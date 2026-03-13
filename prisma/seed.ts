import "dotenv/config";
import { PrismaClient } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: "admin@cleanandfast.cl" },
    update: {},
    create: {
      email: "admin@cleanandfast.cl",
      passwordHash,
      name: "Administrador",
      role: "OWNER",
    },
  });

  await prisma.companyConfig.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      name: "Clean and Fast",
      taxRate: 19,
      currency: "CLP",
      budgetPrefix: "PRES",
      nextSequence: 1,
    },
  });

  console.log("Seed completado: admin@cleanandfast.cl / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
