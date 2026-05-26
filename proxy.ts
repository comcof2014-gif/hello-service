import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/app/lib/supabase/middleware";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "@/app/lib/constants";

const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

function applyCors(request: NextRequest, response: NextResponse): NextResponse {
  const origin = request.headers.get("origin");
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Vary", "Origin");
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
  }
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api");

  // CORS preflight
  if (isApi && request.method === "OPTIONS") {
    return applyCors(request, new NextResponse(null, { status: 204 }));
  }

  if (isApi) {
    return applyCors(request, NextResponse.next({ request }));
  }

  // Supabase session refresh + auth gating (non-API routes)
  const { user, supabaseResponse } = await updateSession(request);

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = AUTH_ROUTES.LOGIN;
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  const isAuthRoute = Object.values(AUTH_ROUTES).some((route) =>
    pathname.startsWith(route),
  );
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
