export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/admin/:path*', '/orders/:path*', '/vip/:path*', '/cart/:path*'],
};

