import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import HtmlRenderer from '@/components/post/HtmlRenderer';
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

// 포스트 콘텐츠 컴포넌트
async function PostContent({ slug }: { slug: string }) {
  const post = await getPostBySlug(slug);

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
