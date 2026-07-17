import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/route-utils";

export async function GET() {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);

  const texts = await prisma.ea_texts.findMany({
    where: { user_group: session.userGroup },
    orderBy: [{ text_no: "asc" }, { uid_text: "asc" }],
  });

  return Response.json(texts);
}
