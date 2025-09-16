import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Github } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact | 개발 블로그',
  description: '궁금한 것이 있으시면 언제든 연락주세요!',
  robots: 'noindex, nofollow'
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-12 px-6">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Contact</h1>
          </div>

          {/* 연락처 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">연락처 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <Mail className="h-6 w-6 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">이메일</p>
                  <p className="text-sm text-muted-foreground">
                    ckswjd9595@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <Phone className="h-6 w-6 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">전화번호</p>
                  <p className="text-sm text-muted-foreground">010-9595-3465</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <Github className="h-6 w-6 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">GitHub</p>
                  <p className="text-sm text-muted-foreground">박찬정</p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <a
                    href="https://github.com/Chanjeong"
                    target="_blank"
                    rel="noopener noreferrer">
                    프로필 보기
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
