import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  
  // Bảo vệ các route admin
  if (request.nextUrl.pathname.startsWith('/(admin)') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Chuyển hướng người dùng đã đăng nhập từ trang login về dashboard
  if (request.nextUrl.pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/(admin)/:path*', '/login'],
};