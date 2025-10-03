'use server';

import { prisma, disconnectPrisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '@/types/jwt';
import { revalidatePath } from 'next/cache';
import { PostFormState } from '@/types/post-editor';

async function checkAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;

    if (!token) return false;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    return !!(decoded.adminId && decoded.role === 'admin');
  } catch {
    return false;
  }
}

// 포스트 생성/수정
export async function savePostAction(prevState: PostFormState, formData: FormData): Promise<PostFormState> {
  // 인증 확인
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return { success: false, error: '인증이 필요합니다.' };
  }

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const published = formData.get('published') === 'true';
  const postId = formData.get('postId') as string;

  // 유효성 검사
  if (!title?.trim()) {
    return { success: false, error: '제목을 입력해주세요.' };
  }
  if (!content?.trim()) {
    return { success: false, error: '내용을 입력해주세요.' };
  }

  try {
    // 한글 친화적인 슬러그 생성 함수
    const createSlug = (text: string): string => {
      return text
        .toLowerCase()
        .replace(/[^\w\s가-힣]/g, '') // 한글, 영문, 숫자, 공백만 남김
        .replace(/\s+/g, '-') // 공백을 하이픈으로
        .trim();
    };

    // 슬러그 생성 (제목 기반)
    const baseSlug = createSlug(title);

    // 고유한 슬러그 생성 (최적화된 방식)
    // 1. 한 번에 모든 관련 슬러그를 가져옴 (성능 최적화)
    const existingSlugs = await prisma.post.findMany({
      where: {
        slug: { startsWith: baseSlug },
        ...(postId && { id: { not: postId } }), // 수정 시에는 현재 포스트 제외
      },
      select: { slug: true },
    });

    // 2. 메모리에서 중복 체크 (초고속)
    let slug = baseSlug;
    let counter = 1;
    while (existingSlugs.some(p => p.slug === slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 트랜잭션으로 포스트 저장 (데이터 일관성 보장)
    const result = await prisma.$transaction(async tx => {
      if (postId) {
        // 포스트 수정
        return await tx.post.update({
          where: { id: postId },
          data: {
            title: title.trim(),
            content: content.trim(),
            slug,
            published,
            updatedAt: new Date(),
          },
        });
      } else {
        // 새 포스트 생성
        return await tx.post.create({
          data: {
            title: title.trim(),
            content: content.trim(),
            slug,
            published,
          },
        });
      }
    });

    // 트랜잭션 성공 후 캐시 무효화
    revalidatePath('/', 'layout');
    revalidatePath('/posts', 'layout');
    revalidatePath(`/post/${slug}`, 'page');

    // 새 게시글인 경우 generateStaticParams 갱신을 위해 전체 post 경로 무효화
    if (!postId) {
      revalidatePath('/post', 'page');
    }

    return { success: true, error: null, postId: result.id };
  } catch {
    return { success: false, error: '포스트 저장 중 오류가 발생했습니다.' };
  } finally {
    // 서버리스 환경에서 연결 정리
    if (process.env.NODE_ENV === 'production') {
      await disconnectPrisma();
    }
  }
}

// 포스트 삭제
export async function deletePostAction(postId: string): Promise<PostFormState> {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return { success: false, error: '인증이 필요합니다.' };
  }

  try {
    await prisma.post.delete({
      where: { id: postId },
    });

    // 게시글 삭제 후 정적 페이지 재생성
    revalidatePath('/', 'layout');
    revalidatePath('/posts', 'layout');
    revalidatePath('/post', 'page');

    return { success: true, error: null };
  } catch {
    return { success: false, error: '포스트 삭제 중 오류가 발생했습니다.' };
  } finally {
    // 서버리스 환경에서 연결 정리
    if (process.env.NODE_ENV === 'production') {
      await disconnectPrisma();
    }
  }
}
