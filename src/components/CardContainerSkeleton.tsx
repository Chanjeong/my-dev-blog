import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface CardContainerSkeletonProps {
  limit: number;
  layout?: 'grid' | 'list';
}

export default function CardContainerSkeleton({ limit, layout = 'grid' }: CardContainerSkeletonProps) {
  const skeletonCount = limit || 3;

  if (layout === 'list') {
    // 리스트 레이아웃 스켈레톤
    return (
      <div className="space-y-6">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // 그리드 레이아웃 스켈레톤
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <Card
          key={index}
          className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 h-48 bg-card border-border"
        >
          <CardHeader className="pb-4">
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-5 w-3/4" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
