import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('veeradmin_token')?.value;

  // Protect all /veeradmin routes
  if (pathname.startsWith('/veeradmin')) {
    // If on the login page itself
    if (pathname === '/veeradmin') {
      if (token) {
        // Logged in user redirect to dashboard
        return NextResponse.redirect(new URL('/veeradmin/dashboard', request.url));
      }
      return NextResponse.next();
    }

    // If on dashboard, services, gallery etc. and not logged in
    if (!token) {
      return NextResponse.redirect(new URL('/veeradmin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/veeradmin/:path*'],
};
