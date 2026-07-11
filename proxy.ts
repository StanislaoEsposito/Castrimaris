import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/* ─────────────────────────────────────────────────────────────────────────
   PROXY (ex Middleware) — Protezione rotte /admin
   ─────────────────────────────────────────────────────────────────────────
   Next.js 16 usa "proxy" invece di "middleware".
   Intercetta tutte le richieste verso /admin/*.
   - Se l'utente NON è autenticato → redirect a /admin/login
   - Se l'utente È autenticato e sta andando su /admin/login → redirect a /admin/dashboard
   - Altrimenti lascia passare e aggiorna i cookie di sessione
   ───────────────────────────────────────────────────────────────────────── */
export async function proxy(request: NextRequest) {
  // Prepara la response che potrebbe essere modificata (aggiunta cookie)
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Imposta i cookie sia sulla request che sulla response
          // (necessario per il refresh automatico del token)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // ⚠️  Usare getUser() — non getSession() — per validazione server-side sicura
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginPage  = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  // Utente non autenticato che tenta di accedere ad /admin/*
  if (isAdminRoute && !isLoginPage && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }

  // Utente già autenticato che visita /admin/login → manda alla dashboard
  if (isLoginPage && user) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/admin/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  // Lascia passare — con i cookie aggiornati
  return supabaseResponse;
}

/* ─────────────────────────────────────────────────────────────────────────
   CONFIG — Percorsi intercettati dal proxy
   ───────────────────────────────────────────────────────────────────────── */
export const config = {
  matcher: ["/admin/:path*"],
};
