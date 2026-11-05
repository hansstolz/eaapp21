import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { Prisma, PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaNamespace?: typeof Prisma;
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
// Reuse the pool only while the generated Prisma module is the same.
const cachedPrisma = globalForPrisma.prismaNamespace === Prisma
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
  globalForPrisma.prismaNamespace = Prisma;
}
