'use client';

import dynamic from 'next/dynamic';
import { LoadingPage } from '@/components/ui/loading';

const FileManagementClient = dynamic(() => import('@/components/admin/FileManagementClient'), {
  ssr: false,
  loading: () => <LoadingPage text="파일 관리자를 로딩 중..." />,
});

export default function FileManagementWrapper() {
  return <FileManagementClient />;
}
