import Link from 'next/link';

export default async function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-2xl mx-auto px-6 py-16 ">
        {/* Name */}
        <h1 className="text-3xl font-bold mb-6 mt-20">
          <Link href="/me" className="underline">
            박찬정
          </Link>
        </h1>

        {/* Introduction */}
        <div className="space-y-4 mb-12">
          <p>
            현재 어센드미디어에서 기획본부에 개발팀으로 근무중인 프론트엔드 개발자입니다. 배우고 싶거나 영감 받은 점들을
            담아두고 있습니다. 머무는 시간만큼은 좋은 기억이셨으면 좋겠습니다.
          </p>
          <p>
            개발 외에도 다양한 것들에 관심이 많아요. 발라드나 팝음악을 자주들어요. 코딩할 때는{' '}
            <a
              href="https://www.youtube.com/watch?v=Dx5qFachd3A"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              재즈
            </a>
            나{' '}
            <a
              href="https://www.youtube.com/watch?v=jfKfPfyJRdk"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              로파이
            </a>{' '}
            음악을 듣습니다. 해외에서 자취를 오래해본 경험으로 요리를 자주 했어요. 혼자 해외에서 오래 살아보았고, 여행을
            통해 다른 나라 음식을 좋아해요. 좋았던 나라는 베트남이에요.
          </p>
        </div>

        {/* Links Section */}
        <div className="mb-12">
          <p className="mb-6">
            제가 쓴{' '}
            <Link href="/writing" className="underline">
              글
            </Link>
            이나{' '}
            <a href="https://github.com/Chanjeong" target="_blank" rel="noopener noreferrer" className="underline">
              코드
            </a>
            를 이곳에서 읽으실 수 있고, 더 궁금하신 점이 있으시면{' '}
            <Link href="/contact" className="underline">
              연락
            </Link>
            주세요, 감사합니다.
          </p>
        </div>
      </main>
    </div>
  );
}
