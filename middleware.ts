import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// Refreshes the Supabase auth session cookie on every request so server
// components see a current session (standard @supabase/ssr pattern), AND mirrors the
// trip-intent cookie into an `x-driftibo-intent` request header so Server Components
// can personalize per lane with no hydration gap (see lib/intent-server.ts).
const INTENT_COOKIE = "driftiboIntent";
const INTENT_HEADER = "x-driftibo-intent";

export async function middleware(request: NextRequest) {
  // Carry the intent forward on the *request* (canonical Next.js 15 pattern: clone the
  // headers, set, and pass via request.headers) so RSCs/pages read it via headers().
  const requestHeaders = new Headers(request.headers);
  const intent = request.cookies.get(INTENT_COOKIE)?.value;
  if (intent) requestHeaders.set(INTENT_HEADER, intent);

  let response = NextResponse.next({ request: { headers: requestHeaders } });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // ponytail: degrade gracefully until env is provisioned — no session work, app still serves.
  if (!url || !key) return response;

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
  return response;
}

export const config = {
  matcher: [
    // everything except static assets / images
    "/((?!_next/static|_next/image|favicon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
