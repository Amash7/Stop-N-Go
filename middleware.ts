import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

    // If accessing admin routes, check if user is admin
    if (isAdminRoute && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Check if user is authenticated (has a token)
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/orders/:path*', '/vip/:path*', '/cart/:path*'],
};

