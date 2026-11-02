import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { getAppOrigin } from "@/lib/app-url";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/login", getAppOrigin(request.url)), 303);

  response.cookies.delete(AUTH_COOKIE_NAME);

  return response;
}
