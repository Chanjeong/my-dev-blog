import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PostEditorWrapper from '@/components/admin/wrapper/PostEditorWrapper';

export const metadata: Metadata = {
  title: '포스트 수정 | 개발 블로그',
  description: '포스트를 수정하는 페이지입니다.',
  robots: 'noindex, nofollow',
};

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPage({ params }: EditPageProps) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
      },
    });
    if (!post) {
      notFound();
    }

    return (
      <PostEditorWrapper
        initialData={{
          id: post.id,
          title: post.title,
          content: post.content,
          published: post.published,
        }}
      />
    );
  } catch {
    notFound();
  }
}
