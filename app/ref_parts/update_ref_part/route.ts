import type { ea_ref_partsUpdateInput } from "@/generated/prisma/models/ea_ref_parts";
import { prisma } from "@/lib/prisma";
import { REF_PART_UPDATE_FIELDS } from "@/lib/ref-fork-fields";
import {
  errorResponse,
  parsePositiveId,
  pickDefinedFields,
  readJsonObject,
} from "@/lib/route-utils";

export async function PUT(request: Request) {
  const body = await readJsonObject(request);

  if (!body) return errorResponse("Ungültiger JSON-Body.", 400);

  const uidRefPart = parsePositiveId(body.uid_ref_part);

  if (!uidRefPart) return errorResponse("Ungültige Feature-ID.", 400);

  const existing = await prisma.ea_ref_parts.findUnique({
    where: { uid_ref_part: uidRefPart },
    select: { uid_ref_part: true },
  });

  if (!existing) return errorResponse("Feature nicht gefunden.", 404);

  const data = pickDefinedFields<ea_ref_partsUpdateInput>(
    body,
    REF_PART_UPDATE_FIELDS,
  );
  const feature = await prisma.ea_ref_parts.update({
    where: { uid_ref_part: uidRefPart },
    data,
  });

  return Response.json(feature);
}
