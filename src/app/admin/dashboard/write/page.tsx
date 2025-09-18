import { Metadata } from 'next';
import PostEditorWrapper from '@/components/admin/wrapper/PostEditorWrapper';

export const metadata: Metadata = {
  title: '포스트 작성 | 개발 블로그',
  description: '새로운 포스트를 작성하는 페이지입니다.',
  robots: 'noindex, nofollow', // 관리자 페이지는 검색엔진에서 제외
};

export default function WritePage() {
  return <PostEditorWrapper />;
}
