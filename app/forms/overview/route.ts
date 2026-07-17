import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth-session";
import { errorResponse } from "@/lib/route-utils";

export async function GET() {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);

  const forms = await prisma.ea_forms_items.findMany({
    where: { user_group: session.userGroup },
    select: {
      uid_forms_item: true,
      user_print_language: true,
      user_group: true,
    },
    orderBy: { uid_forms_item: "asc" },
  });

  return Response.json(forms);
}
