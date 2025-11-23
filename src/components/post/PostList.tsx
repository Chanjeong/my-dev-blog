import { prisma } from '@/lib/prisma';
import Link from 'next/link';
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

      if (posts.length === 0 && retries > 1) {
        retries--;
        await new Promise(resolve => setTimeout(resolve, 500));
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

interface PostListProps {
  limit: number;
}

export default async function PostList({ limit }: PostListProps) {
  const posts = await getPublishedPosts();

  const limitedPosts = limit ? posts.slice(0, limit) : posts;

  if (limitedPosts.length === 0) {
    return (
      <div className="text-muted-foreground">
        <p>아직 발행된 포스트가 없습니다</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2 list-disc list-inside">
      {limitedPosts.map(post => (
        <li key={post.id}>
          <Link href={`/post/${post.slug}`} className="underline">
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
