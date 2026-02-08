import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import HtmlRenderer from '@/components/post/HtmlRenderer';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// React cache()로 동일 요청 내 DB 쿼리 중복 제거
const getPost = cache(async (slug: string) => {
  try {
    return await prisma.post.findUnique({
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
  } catch {
    return null;
  }
});

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

  const post = await getPost(decodedSlug);

  if (!post) {
    notFound();
  }

  // HTML 태그 제거 → 공백 정규화 → 160자 제한
  const description = post.content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
    },
  };
}

// 포스트 콘텐츠 컴포넌트
async function PostContent({ slug }: { slug: string }) {
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="text-sm text-muted-foreground mb-8">
          {new Date(post.createdAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>
      <div>
        <HtmlRenderer content={post.content} />
      </div>
    </div>
  );
}

export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-2xl mx-auto px-6 py-16">
        <PostContent slug={decodedSlug} />
      </main>
    </div>
  );
}
