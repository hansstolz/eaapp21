import "server-only";

import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

export async function getAuthSession() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  return verifyAuthToken(token);
}
