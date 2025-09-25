import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import HtmlRenderer from '@/components/post/HtmlRenderer';
import PostSkeleton from '@/components/post/PostSkeleton';
import { Post } from '@/types/post-editor';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 정적 페이지 생성을 위한 함수
export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true },
    });

    return posts.map(post => ({
      slug: post.slug,
    }));
  } catch {
    return [];
  }
}

// 동적 라우팅 허용 (새 게시글 접근 가능)
export const dynamicParams = true;

// 동적 메타데이터 생성
export async function generateMetadata({ params }: PostPageProps) {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);

  try {
    const post = await prisma.post.findUnique({
      where: {
        slug: decodedSlug,
        published: true,
      },
      select: {
        title: true,
        content: true,
        createdAt: true,
      },
    });

    if (!post) {
      notFound();
    }

    const firstParagraph =
      post.content
        .split('\n')
        .find(line => line.trim().length > 0 && !line.startsWith('#'))
        ?.replace(/[#*`]/g, '')
        ?.trim() || '';

    return {
      title: post.title,
      description: firstParagraph,
      openGraph: {
        title: post.title,
        description: firstParagraph,
        type: 'article',
        publishedTime: post.createdAt.toISOString(),
      },
    };
  } catch {
    notFound();
  }
}

async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug,
        published: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
        slug: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return post;
  } catch {
    return null;
  }
}

// 포스트 콘텐츠 컴포넌트 (Suspense용)
async function PostContent({ slug }: { slug: string }) {
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold mb-4">{post.title}</CardTitle>

        {/* 메타 정보 */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>
              {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* HTML 콘텐츠 */}
        <HtmlRenderer content={post.content} />
      </CardContent>
    </Card>
  );
}

export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-12 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Suspense fallback={<PostSkeleton />}>
            <PostContent slug={decodedSlug} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
