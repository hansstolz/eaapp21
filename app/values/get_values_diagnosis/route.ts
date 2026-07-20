import { getAuthSession } from "@/lib/auth-session";
import { diagnosisDropdown } from "@/lib/diagnosis-fields";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/route-utils";

const VALUE_TYPES = {
  forks_use: "ea_forks_use",
  fork_settings: "ea_forks_settings",
  shockboot: "ea_value_sb",
  headset: "ea_value_hs",
  dial: "ea_value_di",
  telescope: "ea_value_ts",
  cartridge: "ea_value_car",
  air: "ea_value_air",
} as const;

export async function GET() {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const entries = await Promise.all(
    Object.entries(VALUE_TYPES).map(async ([key, type]) => {
      const values = await prisma.ea_values.findMany({
        where: { type, user_group: session.userGroup },
        select: { uid_value: true, value: true },
        orderBy: { value: "asc" },
      });
      return [key, values.map((item) => diagnosisDropdown(item.uid_value, item.value))];
    }),
  );
  return Response.json(Object.fromEntries(entries));
}
