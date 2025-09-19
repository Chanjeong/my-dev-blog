import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MarkdownRenderer from '@/components/MarkdownRenderer';
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
  } catch (error) {
    console.error('generateStaticParams 오류:', error);
    return [];
  }
}

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
      title: `${post.title} | 개발 블로그`,
      description: firstParagraph || '개발 블로그 포스트입니다.',
      openGraph: {
        title: post.title,
        description: firstParagraph || '개발 블로그 포스트입니다.',
        type: 'article',
        publishedTime: post.createdAt.toISOString(),
      },
    };
  } catch (error) {
    console.error('메타데이터 생성 오류:', error);
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

export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);

  const post = await getPostBySlug(decodedSlug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-12 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 포스트 내용 */}
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
              {/* 마크다운 콘텐츠 */}
              <MarkdownRenderer content={post.content} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
