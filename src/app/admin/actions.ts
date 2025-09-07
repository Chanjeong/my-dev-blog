'use server';

import { LoginState } from '@/types/admin';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limit';

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = formData.get('password') as string;
  const secretKey = formData.get('secretKey') as string;

  if (!password || !secretKey) {
    return { success: false, error: '비밀번호와 비밀키를 모두 입력해주세요.' };
  }

  // Rate limiting 체크 (클라이언트 IP 추출)
  const ip = 'unknown'; // SSR에서는 IP 추출이 제한적이므로 기본값 사용
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    return {
      success: false,
      error: `너무 많은 로그인 시도가 있었습니다. 5분 후에 다시 시도해주세요.`
    };
  }

  try {
    // 비밀키 검증
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return {
        success: false,
        error: `비밀키가 올바르지 않습니다. (남은 시도: ${rateLimit.remainingAttempts}회)`
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
        error: `비밀번호가 올바르지 않습니다. (남은 시도: ${rateLimit.remainingAttempts}회)`
      };
    }

    // 로그인 성공 시 Rate limit 리셋
    resetRateLimit(ip);

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

export async function changePasswordAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, error: '모든 필드를 입력해주세요.' };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: '새 비밀번호가 일치하지 않습니다.' };
  }

  if (newPassword.length < 6) {
    return { success: false, error: '새 비밀번호는 6자 이상이어야 합니다.' };
  }

  try {
    // 관리자 계정 조회
    const admin = await prisma.admin.findFirst();

    if (!admin) {
      return { success: false, error: '관리자 계정이 존재하지 않습니다.' };
    }

    // 현재 비밀번호 확인
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      admin.password
    );

    if (!isValidPassword) {
      return { success: false, error: '현재 비밀번호가 올바르지 않습니다.' };
    }

    // 새 비밀번호로 업데이트
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: hashedNewPassword }
    });

    return { success: true, error: null };
  } catch (error) {
    console.error('비밀번호 변경 오류:', error);
    return { success: false, error: '서버 오류가 발생했습니다.' };
  }
}
