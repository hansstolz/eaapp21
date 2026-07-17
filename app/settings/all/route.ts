import { GENERAL_SETTINGS_SELECT } from "@/lib/general-settings-fields";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.ea_settings.findMany({
    select: GENERAL_SETTINGS_SELECT,
    orderBy: { uid_setting: "asc" },
  });

  return Response.json(settings);
}
