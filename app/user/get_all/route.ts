import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.ea_user.findMany({
    orderBy: { uid_user: "asc" },
  });

  return Response.json(users);
}
