import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '@/types/jwt';

export async function GET(request: NextRequest) {
  try {
    // admin-token 쿠키 확인
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // JWT 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

    // 토큰이 유효한지 확인
    if (!decoded.adminId || decoded.role !== 'admin') {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
