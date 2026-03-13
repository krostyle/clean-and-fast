import { defineConfig } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // En producción (Neon) usar la URL directa (sin pooling) para migraciones
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "",
  },
});
