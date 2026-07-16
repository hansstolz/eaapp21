import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  AUTH_TOKEN_TTL_SECONDS,
  createAuthToken,
  isValidLogin,
} from "@/lib/auth";
import { useAuthStore } from "@/lib/stores/auth-store";

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
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = getSafeRedirectPath(formData.get("next"));
  const baseUrl = new URL(request.url);
  const login = useAuthStore.getState().login;

  try {
    if (!isValidLogin(email, password)) {
      const loginUrl = new URL("/login", baseUrl);
      loginUrl.searchParams.set("error", "invalid");
      loginUrl.searchParams.set("next", nextPath);

      return NextResponse.redirect(loginUrl, 303);
    }

    const token = await createAuthToken(email);
    const response = NextResponse.redirect(new URL(nextPath, baseUrl), 303);
    login(email);

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
