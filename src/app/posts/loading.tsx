import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function PostsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 헤더 스켈레톤 */}
          <div className="text-center space-y-4">
            <Skeleton className="h-10 w-32 mx-auto" />
          </div>

          {/* 게시글 목록 스켈레톤 (리스트 레이아웃) */}
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    {/* 제목 스켈레톤 */}
                    <Skeleton className="h-8 w-2/3" />
                    {/* 날짜 스켈레톤 */}
                    <Skeleton className="h-4 w-20" />
                  </div>
                </CardHeader>
                <CardContent>
                  {/* 자세히 보기 링크 스켈레톤 */}
                  <Skeleton className="h-4 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
