import { timingSafeEqual } from "crypto";

export const AUTH_COOKIE_NAME = "eaapp_auth";
export const AUTH_TOKEN_TTL_SECONDS = 60 * 60 * 12;

type JwtHeader = {
  alg: "HS256";
  typ: "JWT";
};

export type AuthTokenPayload = {
  sub: string;
  username: string;
  email: string;
  userGroup: string;
  userRights: string;
  iat: number;
  exp: number;
};

function base64UrlEncode(value: string | Buffer): string {
  return Buffer.from(value)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecode(value: string): Buffer {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(normalized + padding, "base64");
}

async function hmacSha256(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message),
  );

  return base64UrlEncode(Buffer.from(signature));
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return secret;
}

export async function createAuthToken(user: {
  uid: number;
  username: string;
  email: string;
  userGroup: string;
  userRights: string;
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header: JwtHeader = { alg: "HS256", typ: "JWT" };
  const payload: AuthTokenPayload = {
    sub: String(user.uid),
    username: user.username,
    email: user.email,
    userGroup: user.userGroup,
    userRights: user.userRights,
    iat: now,
    exp: now + AUTH_TOKEN_TTL_SECONDS,
  };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const signature = await hmacSha256(unsignedToken, getJwtSecret());

  return `${unsignedToken}.${signature}`;
}

export async function verifyAuthToken(
  token: string | undefined,
): Promise<AuthTokenPayload | null> {
  if (!token) {
    return null;
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    return null;
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const expectedSignature = await hmacSha256(
    `${encodedHeader}.${encodedPayload}`,
    getJwtSecret(),
  );
  const signatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedSignatureBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
  ) {
    return null;
  }

  try {
    const header = JSON.parse(base64UrlDecode(encodedHeader).toString()) as {
      alg?: string;
      typ?: string;
    };

    if (header.alg !== "HS256" || header.typ !== "JWT") {
      return null;
    }

    const payload = JSON.parse(
      base64UrlDecode(encodedPayload).toString(),
    ) as Partial<AuthTokenPayload>;

    if (
      typeof payload.email !== "string" ||
      typeof payload.username !== "string" ||
      typeof payload.userGroup !== "string" ||
      typeof payload.userRights !== "string" ||
      typeof payload.sub !== "string" ||
      typeof payload.exp !== "number" ||
      payload.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return payload as AuthTokenPayload;
  } catch {
    return null;
  }
}
