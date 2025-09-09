import { redirect } from 'next/navigation';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { checkAuthAction } from './actions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '관리자 대시보드 | 로그인',
  description: '블로그와 파일을 관리하는 관리자 대시보드입니다.',
  robots: 'noindex, nofollow' // 관리자 페이지는 검색엔진에서 제외
};

export default async function AdminLoginPage() {
  const { authenticated } = await checkAuthAction();

  if (authenticated) {
    redirect('/admin/dashboard');
  }

  return <AdminLoginForm />;
}
