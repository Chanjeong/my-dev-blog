import { Suspense } from 'react';
import CardContainer from '@/components/post/CardContainers';
import CardContainerSkeleton from '@/components/post/CardContainerSkeleton';

export default async function PostsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 헤더 */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">모든 글</h1>
          </div>

          {/* 게시글 목록 - CardContainer 재사용 (리스트 레이아웃) */}
          <Suspense fallback={<CardContainerSkeleton limit={0} layout="list" />}>
            <CardContainer limit={0} layout="list" />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
