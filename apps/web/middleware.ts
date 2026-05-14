import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Routes that require authentication
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/projects',
  '/datasets',
  '/preprocessing',
  '/training',
  '/experiments',
  '/models',
  '/deployments',
  '/monitoring',
  '/team',
  '/billing',
  '/settings',
];

// Routes that are always public
const PUBLIC_PATHS = [
  '/signin',
  '/signup',
  '/sentry-example-page',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if the route is protected
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (!isProtected) {
    return NextResponse.next();
  }

  // Verify NextAuth session token
  const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev';
  const token = await getToken({
    req: request,
    secret: secret,
  });

  if (!token) {
    console.warn(`[Middleware] No token found for ${pathname}. Redirecting to /signin. (Secret check: ${secret.substring(0, 5)}...)`);
    // Redirect unauthenticated users to sign-in
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  console.log(`[Middleware] Authenticated access to ${pathname} for user ${token.email}`);
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
