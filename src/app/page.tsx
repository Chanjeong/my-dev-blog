import { Suspense } from 'react';
import CardContainer from '@/components/post/CardContainers';
import CardContainerSkeleton from '@/components/post/CardContainerSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DocumentTextIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { BookOpenIcon, MapPinIcon } from 'lucide-react';
import Link from 'next/link';

const hobbies = [
  {
    icon: <MusicalNoteIcon className="h-8 w-8" />,
    title: '음악 감상',
    description: (
      <>
        발라드나 팝음악을 자주들어요. 코딩할 때는{' '}
        <a
          href="https://www.youtube.com/watch?v=Dx5qFachd3A"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          재즈
        </a>
        나{' '}
        <a
          href="https://www.youtube.com/watch?v=jfKfPfyJRdk"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          로파이
        </a>{' '}
        음악을 듣습니다.
      </>
    ),
    color: 'from-pink-500 to-rose-600',
  },
  {
    icon: <BookOpenIcon className="h-8 w-8" />,
    title: '요리',
    description: '해외에서 자취를 오래해본 경험으로 요리를 자주 했어요. 덕분에 요리를 해주는 걸 좋아합니다.',
    color: 'from-green-500 to-emerald-600',
  },
  {
    icon: <MapPinIcon className="h-8 w-8" />,
    title: '여행',
    description: '혼자 해외에서 오래 살아보았고, 여행을 통해 다른 나라 음식을 걸 좋아해요. 좋았던 나라는 베트남이에요',
    color: 'from-orange-500 to-red-600',
  },
];

export default async function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-4">
        {/* Hero Section */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-6">
              <p className="text-md text-muted-foreground max-w-3xl mx-auto italic">
                안녕하세요 프론트엔드 개발자 박찬정입니다. 배우고 싶거나 영감 받은 점들을 담아두고 있습니다.
                <br /> 머무는 시간만큼은 좋은 기억이셨으면 좋겠습니다.
              </p>

              <div className="flex justify-center items-center gap-8 text-muted-foreground">
                <a
                  href="https://velog.io/@jeongchanpark/posts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary transition-colors group"
                >
                  <DocumentTextIcon className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                  <span>이전 블로그</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Posts Section */}
        <section className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-foreground">최신 글</h2>
              <Link href="/posts">
                <Button variant="ghost" className="text-primary hover:text-primary/80">
                  <span className="font-extrabold">모든글 보기</span>
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <Suspense fallback={<CardContainerSkeleton limit={3} />}>
              <CardContainer limit={3} />
            </Suspense>
          </div>
        </section>

        <div className="pt-20 px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* 헤더 */}
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto italic">
                개발 외에도 다양한 것들에 관심이 많아요. 공감하시면 연락한번 주세요:)
              </p>
            </div>

            {/* 취미 카드들 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hobbies.map((hobby, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardHeader className="pb-4">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${hobby.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
                    >
                      {hobby.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold">{hobby.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground leading-relaxed">{hobby.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
