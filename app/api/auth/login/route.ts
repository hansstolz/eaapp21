import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  AUTH_TOKEN_TTL_SECONDS,
  createAuthToken,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function getSafeRedirectPath(value: FormDataEntryValue | null): string {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return "/orders";
  }

  return value;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = getSafeRedirectPath(formData.get("next"));
  const baseUrl = new URL(request.url);

  try {
    const user = await prisma.ea_user.findFirst({
      where: {
        OR: [{ user_name: identifier }, { mail_work: identifier }],
      },
      select: {
        uid_user: true,
        user_name: true,
        mail_work: true,
        user_password: true,
        user_group: true,
        user_rights: true,
      },
    });

    if (!user || user.user_password !== password) {
      const loginUrl = new URL("/login", baseUrl);
      loginUrl.searchParams.set("error", "invalid");
      loginUrl.searchParams.set("next", nextPath);

      return NextResponse.redirect(loginUrl, 303);
    }

    const token = await createAuthToken({
      uid: user.uid_user,
      username: user.user_name ?? identifier,
      email: user.mail_work ?? "",
      userGroup: user.user_group ?? "",
      userRights: user.user_rights ?? "User",
    });
    const response = NextResponse.redirect(new URL(nextPath, baseUrl), 303);

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: AUTH_TOKEN_TTL_SECONDS,
    });

    return response;
  } catch (error) {
    console.error(error);

    const loginUrl = new URL("/login", baseUrl);
    loginUrl.searchParams.set("error", "config");
    loginUrl.searchParams.set("next", nextPath);

    return NextResponse.redirect(loginUrl, 303);
  }
}
