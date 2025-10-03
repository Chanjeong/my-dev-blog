import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function PostLoading() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-12 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 포스트 내용 스켈레톤 */}
          <Card>
            <CardHeader>
              {/* 제목 스켈레톤 */}
              <Skeleton className="h-8 w-3/4 mb-4" />

              {/* 메타 정보 스켈레톤 */}
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
              </div>
            </CardHeader>

            <CardContent>
              {/* 콘텐츠 스켈레톤 */}
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="space-y-2 mt-6">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="space-y-2 mt-6">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
                <div className="space-y-2 mt-6">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
