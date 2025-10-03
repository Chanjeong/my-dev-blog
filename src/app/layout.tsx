import type { Metadata } from 'next';
import { Noto_Serif_KR } from 'next/font/google';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import Navigation from '@/components/layout/Navigation';
import './globals.css';

const notoSerifKR = Noto_Serif_KR({
  variable: '--font-noto-serif-kr',
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: '박찬정',
    template: '%s | 박찬정',
  },
  description: '프론트엔드 개발자 박찬정의 개발 블로그입니다.',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${notoSerifKR.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navigation />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
