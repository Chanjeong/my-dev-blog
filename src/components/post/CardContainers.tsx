import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { Post } from '@/types/post-editor';

async function getPublishedPosts(): Promise<Pick<Post, 'id' | 'title' | 'slug' | 'createdAt' | 'updatedAt'>[]> {
  let retries = 3;

  while (retries > 0) {
    try {
      const posts = await prisma.post.findMany({
        where: { published: true },
        select: {
          id: true,
          title: true,
          slug: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      // 빈 배열이면 재시도
      if (posts.length === 0 && retries > 1) {
        retries--;
        await new Promise(resolve => setTimeout(resolve, 500)); // 0.5초 대기
        continue;
      }

      return posts;
    } catch {
      retries--;
      if (retries === 0) return [];
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return [];
}

interface CardContainerProps {
  limit: number;
  layout?: 'grid' | 'list';
}

export default async function CardContainer({ limit, layout = 'grid' }: CardContainerProps) {
  const posts = await getPublishedPosts();

  const limitedPosts = limit ? posts.slice(0, limit) : posts;

  if (limitedPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-4">아직 발행된 포스트가 없습니다</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 게시글 개수 표시 (limit가 0일 때만) */}
      {limit === 0 && (
        <div className="text-center">
          <p className="text-muted-foreground text-lg">총 {posts.length}개의 게시글</p>
        </div>
      )}

      {/* 레이아웃에 따른 배치 */}
      {layout === 'list' ? (
        // 리스트 레이아웃 (1열)
        <div className="space-y-6">
          {limitedPosts.map(post => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">
                    <Link href={`/post/${post.slug}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <time className="text-sm text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
              </CardHeader>
              <CardContent>
                <Link href={`/post/${post.slug}`} className="text-primary hover:underline font-medium">
                  자세히 보기 →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // 그리드 레이아웃 (3열)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {limitedPosts.map(post => (
            <Link key={post.id} href={`/post/${post.slug}`}>
              <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 h-48 bg-card border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-xl font-semibold leading-tight">
                    {post.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      <span>
                        {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
