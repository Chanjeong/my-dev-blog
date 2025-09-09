import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Upload, Settings } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '관리자 대시보드 | 개발 블로그',
  description: '블로그와 파일을 관리하는 관리자 대시보드입니다.',
  robots: 'noindex, nofollow' // 관리자 페이지는 검색엔진에서 제외
};

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">관리자 대시보드</h1>
            <p className="text-muted-foreground">블로그와 파일을 관리하세요</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 포스트</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 이번 주</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  발행된 포스트
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">+1 이번 주</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">임시저장</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">+1 이번 주</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 조회수</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+12% 이번 달</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />새 포스트 작성
                </CardTitle>
                <CardDescription>
                  새로운 블로그 포스트를 작성하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/dashboard/write">
                  <Button className="w-full">포스트 작성하기</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  파일 관리
                </CardTitle>
                <CardDescription>
                  Portfolio, Resume 파일을 관리하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  파일 관리
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  설정
                </CardTitle>
                <CardDescription>블로그 설정을 관리하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/dashboard/settings">
                  <Button variant="outline" className="w-full">
                    설정
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>최근 포스트</CardTitle>
              <CardDescription>
                최근에 작성한 포스트들을 확인하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center text-muted-foreground py-8">
                  아직 작성된 포스트가 없습니다.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
