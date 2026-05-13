import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Mock authentication logic
  // Since we don't have a real backend yet, we just check if the user is trying to access
  // the dashboard without an 'aetheris_session' cookie.
  // In a real app, you would verify a JWT or session token here.

  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard') || 
                           request.nextUrl.pathname.startsWith('/projects') ||
                           request.nextUrl.pathname.startsWith('/training');

  // We are currently not setting the cookie in the signin page, because 
  // window.location.href = "/dashboard" allows us to simulate the flow easily.
  // However, if we want to block the dashboard strictly, we can check for a cookie.
  // For the sake of the cinematic frontend demo, we will allow access to the dashboard 
  // if they come from the signin page, or we just let them through. 

  // Since this is a demo, let's just log it and pass through to avoid breaking the UX,
  // but if you want strict checking, uncomment the lines below:
  
  /*
  const sessionCookie = request.cookies.get('aetheris_session');
  if (isDashboardRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  */

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
