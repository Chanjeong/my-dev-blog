import { Metadata } from 'next';
import { Mail, Instagram } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact | 개발 블로그',
  description: '궁금한 것이 있으시면 언제든 연락주세요!',
  robots: 'noindex, nofollow',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-2xl mx-auto px-6 py-16 mt-20">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Mail className="h-5 w-5" />
            <div>
              <p className="text-sm text-muted-foreground">이메일</p>
              <a href="mailto:ckswjd9595@gmail.com" className="underline">
                ckswjd9595@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Instagram className="h-5 w-5" />
            <div>
              <p className="text-sm text-muted-foreground">Instagram</p>
              <a href="http://instagram.com/cj_7ark" target="_blank" rel="noopener noreferrer" className="underline">
                @cj_7ark
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
