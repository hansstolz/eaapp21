import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

const PUBLIC_PATHS = new Set(["/login", "/api/auth/login", "/api/auth/logout"]);

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.has(pathname);
}

function isSettingsPath(pathname: string): boolean {
  return (
    pathname.startsWith("/settings") ||
    pathname.startsWith("/forms") ||
    pathname.startsWith("/user")
  );
}

function canManageSettings(userRights: string): boolean {
  const rights = userRights.toLowerCase();
  return rights === "root" || rights === "administrator" || rights === "admin";
}

function isSettingsApiPath(pathname: string): boolean {
  return (
    pathname.startsWith("/forms/") ||
    pathname.startsWith("/user/") ||
    pathname === "/settings/all" ||
    pathname === "/settings/update_values"
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  try {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const payload = await verifyAuthToken(token);

    if (
      payload &&
      (!isSettingsPath(pathname) || canManageSettings(payload.userRights))
    ) {
      return NextResponse.next();
    }

    if (payload && isSettingsPath(pathname)) {
      if (pathname.startsWith("/api/") || isSettingsApiPath(pathname)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      return NextResponse.redirect(new URL("/orders", request.url));
    }
  } catch (error) {
    console.error(error);
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "next",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
