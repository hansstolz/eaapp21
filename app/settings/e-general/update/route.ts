import { getAuthSession } from "@/lib/auth-session";
import { errorResponse, readJsonObject } from "@/lib/route-utils";
import { eGeneralSchema } from "@/app/schemas/general/e-general-schema";
import { updateEGeneralSettings } from "@/lib/e-general-settings";

export async function PUT(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht angemeldet.", 401);
  if (!["root", "administrator", "admin"].includes(session.userRights.toLowerCase()))
    return errorResponse("Keine Berechtigung.", 403);
  const body = await readJsonObject(request);
  const validation = eGeneralSchema.safeParse(body);
  if (!validation.success) return errorResponse(validation.error.issues[0]?.message ?? "Ungültige Einstellungen.", 400);
  try {
    const settings = await updateEGeneralSettings(session.userGroup, validation.data);
    if (!settings) return errorResponse("Einstellungen nicht gefunden.", 404);
    return Response.json(settings);
  } catch (error) {
    console.error("E-General konnte nicht gespeichert werden:", error);
    return errorResponse("Einstellungen konnten nicht gespeichert werden.", 500);
  }
}
