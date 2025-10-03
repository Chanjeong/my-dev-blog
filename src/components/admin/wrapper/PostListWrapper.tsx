'use client';

import dynamic from 'next/dynamic';
import { LoadingCard } from '@/components/ui/loading';
import { PostListProps } from '@/components/admin/PostList';

const PostList = dynamic(() => import('@/components/admin/PostList'), {
  ssr: true,
  loading: () => <LoadingCard text="포스트 목록을 로딩 중..." />,
});

export default function PostListWrapper(props: PostListProps) {
  return <PostList {...props} />;
}
