import type { ea_ref_forksCreateInput } from "@/generated/prisma/models/ea_ref_forks";
import { prisma } from "@/lib/prisma";
import { REF_FORK_CREATE_FIELDS } from "@/lib/ref-fork-fields";
import {
  errorResponse,
  pickDefinedFields,
  readJsonObject,
} from "@/lib/route-utils";

export async function POST(request: Request) {
  const body = await readJsonObject(request);

  if (!body) return errorResponse("Ungültiger JSON-Body.", 400);

  const data = pickDefinedFields<ea_ref_forksCreateInput>(
    body,
    REF_FORK_CREATE_FIELDS,
  );
  const refFork = await prisma.ea_ref_forks.create({
    data: data as ea_ref_forksCreateInput,
  });

  return Response.json(refFork, { status: 201 });
}
