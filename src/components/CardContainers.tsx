import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { Post } from '@/types/post-editor';

async function getPublishedPosts(
  limit?: number
): Promise<Pick<Post, 'id' | 'title' | 'slug' | 'content' | 'createdAt' | 'updatedAt'>[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
      ...(limit && { take: limit }),
    });
    return posts;
  } catch (error) {
    console.error('포스트를 가져오는 중 오류 발생:', error);
    return [];
  }
}

export default async function CardContainer({ limit }: { limit?: number } = {}) {
  const posts = await getPublishedPosts(limit);

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-4">아직 발행된 포스트가 없습니다</h2>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map(post => (
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
  );
}
