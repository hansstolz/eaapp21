import type { Prisma } from "@/generated/prisma/client";
import { getAuthSession } from "@/lib/auth-session";
import { FORK_PART_FIELDS } from "@/lib/fork-fields";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, pickDefinedFields, readJsonObject } from "@/lib/route-utils";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Daten.", 400);
  const uidFork = parsePositiveId(body.uid_fork);
  const uidRefFork = parsePositiveId(body.uid_ref_fork);
  if (!uidFork || !uidRefFork) return errorResponse("Ungültige Fork-Daten.", 400);
  const fork = await prisma.ea_forks.findFirst({
    where: { uid_fork: uidFork, user_group: session.userGroup },
    select: { uid_fork: true },
  });
  if (!fork) return errorResponse("Fork nicht gefunden.", 404);
  const values = pickDefinedFields<Prisma.ea_forks_partsUncheckedCreateInput>(
    body, FORK_PART_FIELDS,
  );
  const part = await prisma.ea_forks_parts.create({
    data: {
      ...values,
      uid_fork: uidFork,
      uid_ref_fork: uidRefFork,
      created_at: new Date(),
      updated_at: new Date(),
    } as Prisma.ea_forks_partsUncheckedCreateInput,
  });
  return Response.json(part, { status: 201 });
}
