'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '@/types/jwt';
import slugify from 'slugify';

export interface PostFormState {
  success: boolean;
  error: string | null;
  postId?: string;
}

// BlockNote 블록 타입 정의
interface BlockNoteContent {
  type: 'text';
  text: string;
  styles?: Record<string, boolean>;
}

interface BlockNoteBlock {
  type: string;
  content?: BlockNoteContent[];
  id?: string;
}

type BlockNoteDocument = BlockNoteBlock[];

// 관리자 인증 확인
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
export async function savePostAction(
  prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  // 인증 확인
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return { success: false, error: '인증이 필요합니다.' };
  }

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const tags = formData.get('tags') as string;
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
    // 슬러그 생성 (제목 기반)
    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
      locale: 'ko'
    });

    // 고유한 슬러그 생성
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existingPost = await prisma.post.findUnique({
        where: { slug },
        select: { id: true }
      });

      if (!existingPost || existingPost.id === postId) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 태그 처리 (JSON 문자열로 저장)
    const tagArray = tags
      ? tags
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean)
      : [];
    const tagsJson = JSON.stringify(tagArray);

    // BlockNote content를 텍스트로 변환하여 excerpt 생성
    let textContent = '';
    try {
      const blocks: BlockNoteDocument = JSON.parse(content);
      textContent = blocks
        .map((block: BlockNoteBlock) => {
          if (block.type === 'paragraph' && block.content) {
            return block.content
              .map((item: BlockNoteContent) => item.text || '')
              .join('');
          }
          return '';
        })
        .join(' ')
        .replace(/[#*`]/g, '');
    } catch {
      textContent = content.replace(/[#*`]/g, '');
    }
    const generatedExcerpt = textContent.substring(0, 150) + '...';

    if (postId) {
      // 포스트 수정
      await prisma.post.update({
        where: { id: postId },
        data: {
          title: title.trim(),
          content: content.trim(),
          excerpt: generatedExcerpt,
          slug,
          published,
          tags: tagsJson,
          updatedAt: new Date()
        }
      });

      return { success: true, error: null, postId };
    } else {
      // 새 포스트 생성
      const newPost = await prisma.post.create({
        data: {
          title: title.trim(),
          content: content.trim(),
          excerpt: generatedExcerpt,
          slug,
          published,
          tags: tagsJson
        }
      });

      return { success: true, error: null, postId: newPost.id };
    }
  } catch (error) {
    console.error('포스트 저장 오류:', error);
    return { success: false, error: '포스트 저장 중 오류가 발생했습니다.' };
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
      where: { id: postId }
    });

    return { success: true, error: null };
  } catch (error) {
    console.error('포스트 삭제 오류:', error);
    return { success: false, error: '포스트 삭제 중 오류가 발생했습니다.' };
  }
}
