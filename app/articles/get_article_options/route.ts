import { getArticleOptions } from "@/lib/article-options";
import { getAuthSession } from "@/lib/auth-session";
import { errorResponse } from "@/lib/route-utils";

export async function GET() {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  return Response.json(await getArticleOptions(session.userGroup));
}
