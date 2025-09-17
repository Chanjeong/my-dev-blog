import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import { Post } from '@/types/post-editor';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
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
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    img: ({ src, alt, ...props }) => (
                      <img
                        src={src}
                        alt={alt}
                        className="w-full max-w-full h-auto my-4"
                        style={{ maxHeight: '500px', objectFit: 'contain' }}
                        {...props}
                      />
                    ),
                    // 코드 블록 스타일링
                    pre: ({ children, ...props }) => (
                      <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto" {...props}>
                        {children}
                      </pre>
                    ),
                    // 인라인 코드 스타일링
                    code: ({ children, ...props }) => (
                      <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    ),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
