export { default }  from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/van-service/:path*', '/profile/:path*'],
};