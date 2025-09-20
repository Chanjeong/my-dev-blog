'use client';

import dynamic from 'next/dynamic';
import { LoadingCard } from '@/components/ui/loading';

const PasswordChangeForm = dynamic(() => import('@/components/admin/PasswordChangeForm'), {
  ssr: false,
  loading: () => <LoadingCard text="설정을 로딩 중..." />,
});

export default function PasswordChangeWrapper() {
  return <PasswordChangeForm />;
}


