import { getAuthSession } from "@/lib/auth-session";
import { dropdownValue } from "@/lib/fork-fields";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/route-utils";

export async function GET() {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const [forks, categories, colors, wheelsizes] = await Promise.all([
    prisma.ea_ref_forks.findMany({
      select: { uid_ref_fork: true, fork_model: true },
      orderBy: { fork_model: "asc" },
    }),
    prisma.ea_values.findMany({
      where: { type: "ea_forks_category", user_group: session.userGroup },
      select: { uid_value: true, value: true }, orderBy: { value: "asc" },
    }),
    prisma.ea_values.findMany({
      where: { type: "ea_forks_color", user_group: session.userGroup },
      select: { uid_value: true, value: true }, orderBy: { value: "asc" },
    }),
    prisma.ea_values.findMany({
      where: { type: "ea_value_ws", user_group: session.userGroup },
      select: { uid_value: true, value: true }, orderBy: { value: "asc" },
    }),
  ]);
  return Response.json({
    ref_forks: forks.map((fork) => ({
      uid: fork.uid_ref_fork,
      label: fork.fork_model ?? "",
      value: String(fork.uid_ref_fork),
    })),
    ref_categories: categories.map((item) => dropdownValue(item.uid_value, item.value)),
    ref_colors: colors.map((item) => dropdownValue(item.uid_value, item.value)),
    ref_wheelsizes: wheelsizes.map((item) => dropdownValue(item.uid_value, item.value)),
  });
}
