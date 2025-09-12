import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Settings } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import PostList from '@/components/admin/PostList';

export const metadata: Metadata = {
  title: '관리자 대시보드 | 개발 블로그',
  description: '블로그와 파일을 관리하는 관리자 대시보드입니다.',
  robots: 'noindex, nofollow'
};

// 게시글 데이터 가져오기
async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Date 객체를 문자열로 변환
    return posts.map(post => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }));
  } catch (error) {
    console.error('게시글 데이터 가져오기 오류:', error);
    return [];
  }
}

// 통계 데이터 가져오기
async function getStats() {
  try {
    const [totalPosts, publishedPosts, draftPosts] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.post.count({ where: { published: false } })
    ]);

    return {
      totalPosts,
      publishedPosts,
      draftPosts
    };
  } catch (error) {
    console.error('통계 데이터 가져오기 오류:', error);
    return {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0
    };
  }
}

export default async function AdminDashboard() {
  const [posts, stats] = await Promise.all([getPosts(), getStats()]);

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">관리자 대시보드</h1>
            <p className="text-muted-foreground">블로그와 파일을 관리하세요</p>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 포스트</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPosts}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.publishedPosts}개 발행됨
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  발행된 포스트
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.publishedPosts}</div>
                <p className="text-xs text-muted-foreground">
                  전체의{' '}
                  {stats.totalPosts > 0
                    ? Math.round(
                        (stats.publishedPosts / stats.totalPosts) * 100
                      )
                    : 0}
                  %
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">임시저장</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.draftPosts}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.draftPosts > 0 ? '작성 완료 대기' : '모두 발행됨'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 액션 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />새 포스트 작성
                </CardTitle>
                <CardDescription>
                  새로운 블로그 포스트를 작성하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/dashboard/write">
                  <Button className="w-full">포스트 작성하기</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  설정
                </CardTitle>
                <CardDescription>블로그 설정을 관리하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/dashboard/settings">
                  <Button variant="outline" className="w-full">
                    설정
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>최근 포스트</CardTitle>
              <CardDescription>
                최근에 작성한 포스트들을 확인하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PostList posts={posts} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
