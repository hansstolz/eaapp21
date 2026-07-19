import type { Prisma } from "@/generated/prisma/client";
import { getAuthSession } from "@/lib/auth-session";
import { FORK_ORDER_UPDATE_FIELDS } from "@/lib/fork-fields";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, pickDefinedFields, readJsonObject } from "@/lib/route-utils";

export async function PUT(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Daten.", 400);
  const uidFork = parsePositiveId(body.uid_fork);
  if (!uidFork) return errorResponse("Ungültige Fork-ID.", 400);
  const existing = await prisma.ea_forks.findFirst({
    where: { uid_fork: uidFork, user_group: session.userGroup },
    select: { uid_fork: true },
  });
  if (!existing) return errorResponse("Fork nicht gefunden.", 404);
  const data = pickDefinedFields<Prisma.ea_forksUncheckedUpdateInput>(
    body, FORK_ORDER_UPDATE_FIELDS,
  );
  const fork = await prisma.ea_forks.update({
    where: { uid_fork: uidFork }, data: { ...data, updated_at: new Date() },
  });
  return Response.json(fork);
}
