import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import PasswordChangeForm from '@/components/admin/PasswordChangeForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '설정 | 관리자 대시보드',
  description: '관리자 계정 설정을 관리하는 페이지입니다.',
  robots: 'noindex, nofollow' // 관리자 페이지는 검색엔진에서 제외
};

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">설정</h1>
            <p className="text-muted-foreground">
              관리자 계정 설정을 관리하세요
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>비밀번호 변경</CardTitle>
              <CardDescription>
                보안을 위해 정기적으로 비밀번호를 변경하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordChangeForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
