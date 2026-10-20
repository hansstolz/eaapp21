import { getAuthSession } from "@/lib/auth-session";

export default async function getLogo() {
  const session = await getAuthSession();
  if (!session) throw new Error("Nicht angemeldet.");

  const userGroup = session.userGroup;
  if (!["88+DE", "88+AU", "88_shop", "88+demo"].includes(userGroup)) {
    throw new Error("Kein Logo für diese Benutzergruppe konfiguriert.");
  }

  return `/_images/${userGroup}_logo.png`;
}
