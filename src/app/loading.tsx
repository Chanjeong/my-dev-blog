import CardContainerSkeleton from '@/components/post/CardContainerSkeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-4">
        {/* Hero Section */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-6">
              <Skeleton className="h-6 w-3/4 mx-auto" />
              <Skeleton className="h-6 w-1/2 mx-auto" />

              <div className="flex justify-center items-center gap-8">
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </section>

        {/* Posts Section */}
        <section className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <Skeleton className="h-8 w-24" />
              <Button variant="ghost" disabled>
                <Skeleton className="h-4 w-20" />
              </Button>
            </div>

            <CardContainerSkeleton limit={3} />
          </div>
        </section>

        <div className="pt-20 px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* 헤더 */}
            <div className="text-center space-y-4">
              <Skeleton className="h-6 w-2/3 mx-auto" />
            </div>

            {/* 취미 카드들 스켈레톤 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardHeader className="pb-4">
                    <Skeleton className="w-16 h-16 rounded-2xl mb-4" />
                    <Skeleton className="h-6 w-20" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
