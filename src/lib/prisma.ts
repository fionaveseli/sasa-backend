import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

console.log("DATABASE_URL loaded:", Boolean(process.env.DATABASE_URL));
console.log("DATABASE_URL preview:", process.env.DATABASE_URL?.slice(0, 35));

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({
  adapter,
});