import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth-session";
import { readEGeneralSettings } from "@/lib/e-general-settings";
import EGeneral from "./e-general";

export default async function Page() {
  const session = await getAuthSession();
  if (!session) redirect("/login");
  if (!["root", "administrator", "admin"].includes(session.userRights.toLowerCase())) redirect("/orders");
  const settings = await readEGeneralSettings(session.userGroup);
  if (!settings.length) return <p className="p-4">Für diese User Group sind noch keine E-General-Einstellungen angelegt.</p>;
  return <EGeneral key={session.userGroup} settings={settings} />;
}
