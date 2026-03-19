import { NextResponse, type NextRequest } from "next/server";
import { signAdminToken, adminCookieOptions, COOKIE_NAME } from "@/lib/admin/auth";

// Rate limiting simples em memória: máx 5 tentativas por IP por minuto
const attempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde 1 minuto." },
      { status: 429 }
    );
  }

  const { email, password } = await request.json();

  const validEmail = process.env.ADMIN_EMAIL;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (
    !validEmail ||
    !validPassword ||
    email !== validEmail ||
    password !== validPassword
  ) {
    return NextResponse.json(
      { error: "Credenciais inválidas." },
      { status: 401 }
    );
  }

  const token = await signAdminToken();
  const isProd = process.env.NODE_ENV === "production";
  const response = NextResponse.json({ ok: true });

  response.cookies.set(COOKIE_NAME, token, adminCookieOptions(isProd));

  return response;
}
