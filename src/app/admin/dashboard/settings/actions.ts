'use server';

import { LoginState } from '@/types/admin';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

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
