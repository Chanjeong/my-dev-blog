import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Metadata } from 'next';
import PasswordChangeWrapper from '@/components/admin/wrapper/PasswordChangeWrapper';

export const metadata: Metadata = {
  title: '설정 | 관리자 대시보드',
  description: '블로그 관리자 설정 페이지입니다.',
  robots: 'noindex, nofollow',
};

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>비밀번호 변경</CardTitle>
            </CardHeader>
            <CardContent>
              <PasswordChangeWrapper />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
