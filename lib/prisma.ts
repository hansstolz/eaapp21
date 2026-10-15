import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { Prisma, PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaSchema?: string;
};

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL ist nicht konfiguriert.");
  }

  const connectionUrl = new URL(databaseUrl);
  connectionUrl.searchParams.set("allowPublicKeyRetrieval", "true");

  const adapter = new PrismaMariaDb(connectionUrl.toString());

  return new PrismaClient({ adapter });
}

// Fast Refresh preserves globalThis even after regenerating the Prisma client.
// Reuse a connection pool only when its generated models still match.
const schema = JSON.stringify(Prisma.ModelName);
const cachedPrisma = globalForPrisma.prismaSchema === schema
  ? globalForPrisma.prisma
  : undefined;

export const prisma = cachedPrisma ?? createPrismaClient();

if (globalForPrisma.prisma && globalForPrisma.prisma !== prisma) {
  void globalForPrisma.prisma.$disconnect().catch((error: unknown) => {
    console.error("Veralteter Prisma-Client konnte nicht geschlossen werden.", error);
  });
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaSchema = schema;
}
