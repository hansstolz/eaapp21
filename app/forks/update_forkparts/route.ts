import type { Prisma } from "@/generated/prisma/client";
import { getAuthSession } from "@/lib/auth-session";
import { FORK_PART_FIELDS } from "@/lib/fork-fields";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, pickDefinedFields, readJsonObject } from "@/lib/route-utils";

export async function PUT(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Daten.", 400);
  const uidPart = parsePositiveId(body.uid_forks_part);
  if (!uidPart) return errorResponse("Ungültige Feature-ID.", 400);
  const existing = await prisma.ea_forks_parts.findUnique({
    where: { uid_forks_part: uidPart }, select: { uid_fork: true },
  });
  if (!existing) return errorResponse("Fork-Feature nicht gefunden.", 404);
  const fork = await prisma.ea_forks.findFirst({
    where: { uid_fork: existing.uid_fork, user_group: session.userGroup },
    select: { uid_fork: true },
  });
  if (!fork) return errorResponse("Fork-Feature nicht gefunden.", 404);
  const data = pickDefinedFields<Prisma.ea_forks_partsUncheckedUpdateInput>(
    body, FORK_PART_FIELDS,
  );
  delete data.uid_fork;
  const part = await prisma.ea_forks_parts.update({
    where: { uid_forks_part: uidPart }, data: { ...data, updated_at: new Date() },
  });
  return Response.json(part);
}
