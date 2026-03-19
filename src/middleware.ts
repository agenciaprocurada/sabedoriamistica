import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_PREFIXES = [
  "/sonhos/analisar",
  "/sonhos/resultado",
  "/sonhos/checkout",
  "/sonhos/completo",
  "/meus-dados",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
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

  const { data: { user } } = await supabase.auth.getUser();

  // Usuário logado tentando acessar /login → redireciona para /sonhos
  if (user && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/sonhos", request.url));
  }

  // Usuário não logado em rota protegida → redireciona para login
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!user && isProtected) {
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
