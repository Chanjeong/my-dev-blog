import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: '비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 관리자 계정 조회
    const admin = await prisma.admin.findFirst();

    if (!admin) {
      return NextResponse.json(
        { error: '관리자 계정이 존재하지 않습니다.' },
        { status: 404 }
      );
    }

    // 비밀번호 확인
    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: '비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 비밀번호가 맞으면 성공 응답
    return NextResponse.json({ message: '인증 성공' }, { status: 200 });
  } catch (error) {
    console.error('비밀번호 검증 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
