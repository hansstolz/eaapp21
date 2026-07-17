import type { ea_settingsUpdateInput } from "@/generated/prisma/models/ea_settings";
import {
  GENERAL_SETTINGS_SELECT,
  GENERAL_SETTINGS_UPDATE_FIELDS,
} from "@/lib/general-settings-fields";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  parsePositiveId,
  pickDefinedFields,
  readJsonObject,
} from "@/lib/route-utils";

export async function PUT(request: Request) {
  const body = await readJsonObject(request);

  if (!body) return errorResponse("Ungültiger JSON-Body.", 400);

  const uidSetting = parsePositiveId(body.uid_setting);

  if (!uidSetting) return errorResponse("Ungültige Settings-ID.", 400);

  const existing = await prisma.ea_settings.findUnique({
    where: { uid_setting: uidSetting },
    select: { uid_setting: true },
  });

  if (!existing) return errorResponse("Settings nicht gefunden.", 404);

  const data = pickDefinedFields<ea_settingsUpdateInput>(
    body,
    GENERAL_SETTINGS_UPDATE_FIELDS,
  );
  const settings = await prisma.ea_settings.update({
    where: { uid_setting: uidSetting },
    data,
    select: GENERAL_SETTINGS_SELECT,
  });

  return Response.json(settings);
}
