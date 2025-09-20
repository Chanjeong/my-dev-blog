import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 헤더 */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">모든 글</h1>
            <p className="text-muted-foreground text-lg">총 {posts.length}개의 게시글</p>
          </div>

          {/* 게시글 목록 */}
          <div className="space-y-6">
            {posts.map(post => (
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

          {/* 게시글이 없는 경우 */}
          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">아직 게시글이 없습니다.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
