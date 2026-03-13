import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }
  return globalForPrisma.prisma;
}

// Lazy proxy: PrismaClient is only instantiated on first property access (runtime),
// never at module load time (build), so missing DATABASE_URL during build is safe.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getClient() as any)[prop as string];
  },
});
