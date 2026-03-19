import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { jwtVerify } from "jose";

// ── Rotas protegidas por auth Supabase (usuários do portal) ──
const PORTAL_PROTECTED = [
  "/sonhos/analisar",
  "/sonhos/resultado",
  "/sonhos/checkout",
  "/sonhos/completo",
  "/meus-dados",
];

// ── Rotas admin protegidas por JWT cookie ──
const ADMIN_PREFIX = "/sabedoriaadm";
const ADMIN_LOGIN = "/sabedoriaadm/login";

async function verifyAdminJwt(token: string): Promise<boolean> {
  try {
    const secret = process.env.ADMIN_SECRET;
    if (!secret) return false;
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Guard admin (independente do Supabase) ───────────────
  if (
    pathname.startsWith(ADMIN_PREFIX) &&
    !pathname.startsWith(ADMIN_LOGIN)
  ) {
    const token = request.cookies.get("admin_session")?.value;
    const valid = token ? await verifyAdminJwt(token) : false;
    if (!valid) {
      return NextResponse.redirect(new URL(ADMIN_LOGIN, request.url));
    }
    return NextResponse.next();
  }

  // ── 2. Guard portal (Supabase) ──────────────────────────────
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Usuário logado acessando /login → redireciona para /sonhos
  if (user && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/sonhos", request.url));
  }

  // Usuário não logado em rota protegida do portal → /login?redirect=...
  const isPortalProtected = PORTAL_PROTECTED.some((p) =>
    pathname.startsWith(p)
  );
  if (!user && isPortalProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
