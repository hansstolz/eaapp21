import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/route-utils";

export async function GET() {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const forms = await prisma.ea_forms_items.findMany({
    where: { user_group: session.userGroup },
    select: { user_print_language: true },
    orderBy: { uid_forms_item: "asc" },
  });
  const languages = [...new Set(forms.map((form) => form.user_print_language?.trim()).filter((language): language is string => Boolean(language)))];
  return Response.json(languages);
}
