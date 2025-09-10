import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Calendar, Eye } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  createdAt: Date;
  viewCount: number;
}

async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        excerpt: true,
        slug: true,
        createdAt: true,
        viewCount: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return posts;
  } catch (error) {
    console.error('포스트를 가져오는 중 오류 발생:', error);
    return [];
  }
}

export default async function CardContainer() {
  const posts = await getPublishedPosts();

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-4">
          아직 발행된 포스트가 없습니다
        </h2>
        <p className="text-gray-500 dark:text-gray-500">
          관리자 페이지에서 포스트를 작성하고 발행해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map(post => (
        <Link key={post.id} href={`/post/${post.slug}`}>
          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 h-full">
            <CardHeader>
              <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </CardTitle>
              <CardDescription className="line-clamp-3">
                {post.excerpt || '요약이 없습니다.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* 메타 정보 */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{post.viewCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
