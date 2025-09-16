import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { PostWithThumbnail } from '@/types/post-editor';

const generateThumbnailUrl = (title: string, width: number = 400, height: number = 250): string => {
  return `https://dummyimage.com/${width}x${height}/00d4aa/FFFFFF&text=喜怒哀樂`;
};

const extractThumbnailFromContent = (content: string): string | null => {
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(imageRegex);
  return match ? match[1] : null;
};

async function getPublishedPosts(): Promise<PostWithThumbnail[]> {
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
        <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-4">아직 발행된 포스트가 없습니다</h2>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map(post => {
        const thumbnailUrl = extractThumbnailFromContent(post.content) || generateThumbnailUrl(post.title);

        return (
          <Link key={post.id} href={`/post/${post.slug}`}>
            <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 h-full overflow-hidden">
              <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                <Image
                  src={thumbnailUrl}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <CardHeader>
                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">{post.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span>
                      {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
