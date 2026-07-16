import type { ea_ref_partsCreateInput } from "@/generated/prisma/models/ea_ref_parts";
import { prisma } from "@/lib/prisma";
import { REF_PART_CREATE_FIELDS } from "@/lib/ref-fork-fields";
import {
  errorResponse,
  parsePositiveId,
  pickDefinedFields,
  readJsonObject,
} from "@/lib/route-utils";

export async function POST(request: Request) {
  const body = await readJsonObject(request);

  if (!body) return errorResponse("Ungültiger JSON-Body.", 400);

  const uidRefFork = parsePositiveId(body.uid_ref_fork);

  if (!uidRefFork) return errorResponse("Ungültige Referenzgabel-ID.", 400);

  const data = pickDefinedFields<ea_ref_partsCreateInput>(
    { ...body, uid_ref_fork: uidRefFork },
    REF_PART_CREATE_FIELDS,
  );
  const feature = await prisma.ea_ref_parts.create({
    data: data as ea_ref_partsCreateInput,
  });

  return Response.json(feature, { status: 201 });
}
