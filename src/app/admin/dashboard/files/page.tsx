import { Metadata } from 'next';
import FileManagementWrapper from '@/components/admin/wrapper/FileManagementWrapper';

export const metadata: Metadata = {
  title: '파일 관리 | 개발 블로그',
  description: '이력서와 포트폴리오를 관리하는 페이지입니다.',
  robots: 'noindex, nofollow',
};

export default function FileManagement() {
  return <FileManagementWrapper />;
}
