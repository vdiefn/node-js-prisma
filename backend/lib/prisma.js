import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DATABASE_URL } = process.env;
const connectionString =
  DATABASE_URL ||
  `postgresql://${DB_USERNAME || "student"}:${DB_PASSWORD || "student666"}@${DB_HOST || "localhost"}:${DB_PORT || 5432}/${DB_DATABASE || "fitness"}`;
// 直接將連線字串傳入 PrismaPg Adapter
const adapter = new PrismaPg({
  connectionString,
});

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
