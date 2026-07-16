import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const refForks = await prisma.ea_ref_forks.findMany({
      orderBy: {
        uid_ref_fork: "asc",
      },
    });

    return Response.json(refForks);
  } catch (error) {
    console.error("Referenzgabeln konnten nicht geladen werden:", error);

    return Response.json(
      { error: "Referenzgabeln konnten nicht geladen werden." },
      { status: 500 },
    );
  }
}
