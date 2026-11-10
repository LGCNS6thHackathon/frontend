import { NextRequest, NextResponse } from "next/server";

export function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    // NextURL normalizes loopback hosts to localhost. The original Host retains
    // the browser's actual origin, including 127.0.0.1 and its port.
    const host = request.headers.get("host") || request.nextUrl.host;
    return new URL(origin).origin === `${request.nextUrl.protocol}//${host}`;
  } catch {
    return false;
  }
}

export type SessionTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
};

export function withSessionCookies(
  response: NextResponse,
  tokens?: SessionTokens,
) {
  const options = {
    httpOnly: true,
    secure:
      process.env.NODE_ENV === "production" &&
      process.env.COOKIE_SECURE !== "false",
    sameSite: "lax" as const,
    path: "/",
  };
  response.cookies.set("lms_access", tokens?.accessToken || "", {
    ...options,
    maxAge: tokens?.expiresIn || 0,
  });
  response.cookies.set("lms_refresh", tokens?.refreshToken || "", {
    ...options,
    maxAge: tokens?.refreshExpiresIn || 0,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
