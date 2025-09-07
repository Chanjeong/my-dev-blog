import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // admin 경로가 아닌 경우 통과
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // admin 로그인 페이지는 통과
  if (pathname === '/admin') {
    return NextResponse.next();
  }

  // admin-token 쿠키가 있는지만 확인 (JWT 검증은 각 페이지에서)
  const token = request.cookies.get('admin-token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // 토큰이 있으면 통과 (실제 검증은 각 페이지에서)
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
