import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { JWTPayload } from '@/types/jwt';

export default async function AdminLoginPage() {
  // 서버에서 쿠키 확인 (SSR)
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;

  if (token) {
    try {
      // JWT 토큰 검증
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

      // 토큰이 유효하면 dashboard로 리다이렉트
      if (decoded.adminId && decoded.role === 'admin') {
        redirect('/admin/dashboard');
      }
    } catch (error) {
      // JWT 검증 실패 (토큰이 유효하지 않음)
      // 로그인 페이지를 표시하기 위해 계속 진행
    }
  }

  // 로그인 페이지 표시
  return <AdminLoginForm />;
}
