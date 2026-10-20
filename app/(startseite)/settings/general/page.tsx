import { Suspense } from "react";
import General from "./general";
import type { GeneralSettings } from "@/app/schemas/general/general_schmea";
import { GENERAL_SETTINGS_SELECT } from "@/lib/general-settings-fields";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth-session";
import { notFound, redirect } from "next/navigation";
import getLogo from "@/lib/hooks/use-logo";

export default async function Page() {
  const session = await getAuthSession();
  if (!session) redirect("/login");

  const [data, logo_path] = await Promise.all([
    prisma.ea_settings.findMany({
      where: { user_group: session.userGroup },
      select: GENERAL_SETTINGS_SELECT,
      orderBy: { uid_setting: "asc" },
    }),
    getLogo(),
  ]);

  if (!data.length) notFound();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <General key={session.userGroup} data={data as GeneralSettings[]} logo_path={logo_path} />
    </Suspense>
  );
}
