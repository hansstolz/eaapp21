import type { DropdownItem } from "@/app/data_types/general/dropdown";
import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/route-utils";
import { isGlobalValueType } from "@/lib/value-access";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ type: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);

  const type = decodeURIComponent((await params).type);
  const rows = await prisma.ea_values.findMany({
    where: {
      type,
      value: { not: null },
      ...(isGlobalValueType(type) ? {} : { user_group: session.userGroup }),
    },
    select: { uid_value: true, value: true },
    orderBy: { value: "asc" },
  });
  const values: DropdownItem[] = rows
    .filter((row): row is { uid_value: number; value: string } => Boolean(row.value?.trim()))
    .map((row) => ({ uid: row.uid_value, label: row.value, value: row.value }));

  return Response.json(values);
}
