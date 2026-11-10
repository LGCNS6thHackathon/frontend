import { NextRequest, NextResponse } from "next/server";
import { IS_MOCK } from "@/lib/data-mode";
import { isSameOrigin, withSessionCookies } from "@/lib/auth-cookies";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function configuredAccount() {
  const email = process.env.DEMO_ADMIN_EMAIL?.trim();
  const password = process.env.DEMO_ADMIN_PASSWORD;
  if (IS_MOCK || process.env.DEMO_ADMIN_LOGIN_ENABLED !== "true" || !email || !password)
    return null;
  return { email, password };
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export function GET() {
  return json({ enabled: configuredAccount() !== null });
}

export async function POST(request: NextRequest) {
  const account = configuredAccount();
  if (!account)
    return json({ message: "관리자 빠른 로그인이 설정되지 않았습니다." }, 404);
  if (!isSameOrigin(request))
    return json({ message: "요청 출처를 확인해주세요." }, 403);

  const backend = (process.env.BACKEND_URL || "http://127.0.0.1:8080").replace(/\/$/, "");
  try {
    // Only the configured server-side account is used; client input cannot select a user.
    const response = await fetch(`${backend}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(account),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok)
      return json({ message: "발표용 관리자 계정으로 로그인하지 못했습니다. 서버의 계정 설정을 확인해주세요." }, 502);
    const tokens = await response.json();
    if (tokens.user?.role !== "ADMIN" || tokens.user?.status !== "ACTIVE")
      return json({ message: "활성 관리자 계정으로 설정해주세요." }, 403);
    if (
      typeof tokens.accessToken !== "string" || !tokens.accessToken ||
      typeof tokens.refreshToken !== "string" || !tokens.refreshToken ||
      !Number.isFinite(tokens.expiresIn) || tokens.expiresIn <= 0 ||
      !Number.isFinite(tokens.refreshExpiresIn) || tokens.refreshExpiresIn <= 0
    )
      return json({ message: "로그인 응답을 확인할 수 없습니다." }, 502);
    return withSessionCookies(json({ user: tokens.user }), tokens);
  } catch {
    return json({ message: "백엔드 서버에 연결하지 못했습니다. 서버 실행 상태를 확인해주세요." }, 502);
  }
}
