import type { ea_ref_forksUpdateInput } from "@/generated/prisma/models/ea_ref_forks";
import { prisma } from "@/lib/prisma";
import { REF_FORK_UPDATE_FIELDS } from "@/lib/ref-fork-fields";
import {
  errorResponse,
  parsePositiveId,
  pickDefinedFields,
  readJsonObject,
} from "@/lib/route-utils";

export async function PUT(request: Request) {
  const body = await readJsonObject(request);

  if (!body) return errorResponse("Ungültiger JSON-Body.", 400);

  const uidRefFork = parsePositiveId(body.uid_ref_fork);

  if (!uidRefFork) return errorResponse("Ungültige Referenzgabel-ID.", 400);

  const existing = await prisma.ea_ref_forks.findUnique({
    where: { uid_ref_fork: uidRefFork },
    select: { uid_ref_fork: true },
  });

  if (!existing) return errorResponse("Referenzgabel nicht gefunden.", 404);

  const data = pickDefinedFields<ea_ref_forksUpdateInput>(
    body,
    REF_FORK_UPDATE_FIELDS,
  );
  const refFork = await prisma.ea_ref_forks.update({
    where: { uid_ref_fork: uidRefFork },
    data,
  });

  return Response.json(refFork);
}
