'use client';

import dynamic from 'next/dynamic';
import { LoadingPage } from '@/components/ui/loading';
import { PostEditorProps } from '@/components/admin/PostEditor';

const PostEditor = dynamic(() => import('@/components/admin/PostEditor'), {
  ssr: false,
  loading: () => <LoadingPage text="에디터를 로딩 중..." />,
});

export default function PostEditorWrapper(props: PostEditorProps) {
  return <PostEditor {...props} />;
}
