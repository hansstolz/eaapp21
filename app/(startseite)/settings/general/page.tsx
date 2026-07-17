import { Suspense } from "react";
import General from "./general";
import type { GeneralSettings } from "@/app/schemas/general/general_schmea";
import { GENERAL_SETTINGS_SELECT } from "@/lib/general-settings-fields";
import { prisma } from "@/lib/prisma";
import getLogo from "@/lib/hooks/use-logo";

export default async function Page() {
  const [data, logo_path] = await Promise.all([
    prisma.ea_settings.findMany({
      select: GENERAL_SETTINGS_SELECT,
      orderBy: { uid_setting: "asc" },
    }),
    getLogo(),
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <General data={data as GeneralSettings[]} logo_path={logo_path} />
    </Suspense>
  );
}
