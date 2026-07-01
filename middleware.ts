import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// Refreshes the Supabase auth session cookie on every request so server
// components see a current session (standard @supabase/ssr pattern), AND mirrors the
// trip-intent cookie into an `x-driftibo-intent` request header so Server Components
// can personalize per lane with no hydration gap (see lib/intent-server.ts).
const INTENT_COOKIE = "driftiboIntent";
const INTENT_HEADER = "x-driftibo-intent";
const PREVIEW_COOKIE = "driftibo_preview";
const PREVIEW_MAX_AGE = 60 * 60 * 24 * 30;

function isComingSoonAllowed(pathname: string) {
  if (pathname === "/soon") return true;
  if (pathname === "/api" || pathname.startsWith("/api/")) return true;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/favicon")) return true;
  if (pathname === "/site.webmanifest") return true;
  if (pathname === "/og.jpg") return true;
  if (pathname === "/visual-bank" || pathname.startsWith("/visual-bank/")) return true;
  if (pathname === "/images" || pathname.startsWith("/images/")) return true;
  return /\.[^/]+$/.test(pathname);
}

function setPreviewCookie(response: NextResponse) {
  response.cookies.set(PREVIEW_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PREVIEW_MAX_AGE,
  });
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const previewSecret = process.env.PREVIEW_SECRET;
  const COMING_SOON_ON = ["1", "true", "yes", "on"].includes((process.env.COMING_SOON ?? "").trim().toLowerCase());
  const previewMatches = Boolean(
    previewSecret && searchParams.get("preview") === previewSecret,
  );
  const hasPreviewCookie = request.cookies.has(PREVIEW_COOKIE);

  if (
    COMING_SOON_ON &&
    !isComingSoonAllowed(pathname) &&
    !previewMatches &&
    !hasPreviewCookie
  ) {
    return NextResponse.rewrite(new URL("/soon", request.url));
  }

  // Carry the intent forward on the *request* (canonical Next.js 15 pattern: clone the
  // headers, set, and pass via request.headers) so RSCs/pages read it via headers().
  const requestHeaders = new Headers(request.headers);
  const intent = request.cookies.get(INTENT_COOKIE)?.value;
  if (intent) requestHeaders.set(INTENT_HEADER, intent);

  let response = NextResponse.next({ request: { headers: requestHeaders } });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // ponytail: degrade gracefully until env is provisioned — no session work, app still serves.
  if (!url || !key) {
    if (previewMatches) setPreviewCookie(response);
    return response;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request: { headers: requestHeaders } });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  await supabase.auth.getUser();
  if (previewMatches) setPreviewCookie(response);
  return response;
}

export const config = {
  matcher: [
    // everything except static assets / images
    "/((?!_next/static|_next/image|favicon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
