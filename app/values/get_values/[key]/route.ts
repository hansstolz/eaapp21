import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";
import {
  isGlobalValueType,
  valueAccessWhere,
} from "@/lib/value-access";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);

  const key = decodeURIComponent((await params).key);
  const uid = parsePositiveId(key);

  if (uid) {
    const value = await prisma.ea_values.findFirst({
      where: valueAccessWhere(uid, session.userGroup),
    });
    if (!value) return errorResponse("Wert nicht gefunden.", 404);
    return Response.json(value);
  }

  const values = await prisma.ea_values.findMany({
    where: {
      type: key,
      ...(isGlobalValueType(key) ? {} : { user_group: session.userGroup }),
    },
    orderBy: [{ value: "asc" }, { uid_value: "asc" }],
  });

  return Response.json(values);
}
