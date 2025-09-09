'use server';

import { LoginState } from '@/types/admin';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { JWTPayload } from '@/types/jwt';

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = formData.get('password') as string;
  const secretKey = formData.get('secretKey') as string;

  if (!password || !secretKey) {
    return { success: false, error: '비밀번호와 비밀키를 모두 입력해주세요.' };
  }

  try {
    // 비밀키 검증
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return {
        success: false,
        error: '비밀키가 올바르지 않습니다.'
      };
    }

    // 관리자 계정 조회
    const admin = await prisma.admin.findFirst();

    if (!admin) {
      return { success: false, error: '관리자 계정이 존재하지 않습니다.' };
    }

    // 비밀번호 확인
    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return {
        success: false,
        error: '비밀번호가 올바르지 않습니다.'
      };
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      {
        adminId: admin.id,
        timestamp: Date.now(),
        role: 'admin'
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    // HttpOnly 쿠키로 설정
    (await cookies()).set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 // 1시간
    });

    return { success: true, error: null };
  } catch (error) {
    console.error('로그인 오류:', error);
    return { success: false, error: '서버 오류가 발생했습니다.' };
  }
}

export async function checkAuthAction(): Promise<{ authenticated: boolean }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;

    if (!token) {
      return { authenticated: false };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

    if (!decoded.adminId || decoded.role !== 'admin') {
      return { authenticated: false };
    }

    return { authenticated: true };
  } catch {
    return { authenticated: false };
  }
}
